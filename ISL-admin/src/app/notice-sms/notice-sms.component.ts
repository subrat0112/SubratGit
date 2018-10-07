
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

// @Component({
//   selector: 'app-notice-sms',
//   templateUrl: './notice-sms.component.html',
//   styleUrls: ['./notice-sms.component.css']
// })

@Component({
  selector: 'sms',
  templateUrl: './notice-sms.component.html',
  styleUrls: ['../app.component.css']
})

export class NoticeSMSComponent {
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  groups: Group[] = [
    { value: 'School', viewValue: 'School' },
    { value: 'ClassSec', viewValue: 'Class and Section' },
    { value: 'Class', viewValue: 'Class' },
    { value: 'Student', viewValue: 'Individual Student' }
  ];

  classes: Class[] = [
    { value: 'I', viewValue: 'Std-I', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'II', viewValue: 'Std-II', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'III', viewValue: 'Std-III', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'IV', viewValue: 'Std-IV', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'V', viewValue: 'Std-V', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'VI', viewValue: 'Std-VI', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'VII', viewValue: 'Std-VII', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'VIII', viewValue: 'Std-VIII', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'IX', viewValue: 'Std-IX', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'X', viewValue: 'Std-X', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'XI', viewValue: 'Std-XI', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] },
    { value: 'XII', viewValue: 'Std-XII', sections: [{ value: 'A', viewValue: 'Sec-A' }, { value: 'B', viewValue: 'Sec-B' }] }
  ];

  myControl = new FormControl();
  searchedStudents: string[];

  searchInput: string;
  selectedClass: Class;
  selectedGroup: string;
  SMSText: string;
  selectedSection: string;
  selectedStudents: Student[];
  dataTosend: any;

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {
    this.selectedClass = this.classes[0];
    this.selectedGroup = 'School';
    this.SMSText = '';
    this.selectedStudents = [];
  }

  onSearchInput(e) {
    if (this.searchInput === '') {
      this.searchedStudents = [];
    } else {
      this.search(this.searchInput).then((res) => {
        this.searchedStudents = res.lstSearchedStudent;
      });
    }
  }

  pushStudent(stu) {
    console.log(stu);
    this.selectedStudents.push(stu);
  }

  sendSMS() {
    if (this.selectedGroup === 'Student') {
      for (const i in this.selectedStudents) {
          if (this.selectedStudents[i]) {
          this.dataTosend = {
            'UID': this.selectedStudents[i].studentId.trim(),
            'Class': 'ALL',
            'Section': 'ALL',
            'Text': this.SMSText
          };
          this.sendSMSSevice(this.dataTosend).then((res) => {
            console.log(res);
            this.snackBar.open('SMS ', 'Sent', {
              duration: 2000,
            });
          });
        }
      }
    } else {
      this.dataTosend = {};
      switch (this.selectedGroup) {
        case 'School':
          this.dataTosend = {
            'UID': 'ALL',
            'Class': 'ALL',
            'Section': 'ALL',
            'Text': this.SMSText
          };
          break;
        case 'Class':
          this.dataTosend = {
            'UID': 'ALL',
            'Class': this.selectedClass.viewValue,
            'Section': 'ALL',
            'Text': this.SMSText
          };
          break;
        case 'ClassSec':
          this.dataTosend = {
            'UID': 'ALL',
            'Class': this.selectedClass.viewValue,
            'Section': this.selectedSection,
            'Text': this.SMSText
          };
          break;
      }
      this.sendSMSSevice(this.dataTosend).then((res) => {
        console.log(res);
        this.snackBar.open('SMS ', 'Sent', {
          duration: 2000,
        });
      });
    }
  }

  sendSMSSevice(data) {
    console.log(data);
    return this.http.post('http://ec2-52-66-139-29.ap-south-1.compute.amazonaws.com:3000/api/postSMS',
    data, { headers: this.headers }).toPromise();
  }

  search(data): Promise<any> {
    return this.http.get('http://ec2-52-66-139-29.ap-south-1.compute.amazonaws.com:8051/'
    + 'api/UserDetails/GetSearchedStudent/' + this.selectedClass.viewValue + '/' + this.selectedSection + '/' + data).toPromise();
  }

}


export interface Group {
  value: string;
  viewValue: string;
}

export interface Class {
  value: string;
  viewValue: string;
  sections: Group[];
}

export interface Student {
  absentDate: string;
  studentId: string;
  studentName: string;
}
