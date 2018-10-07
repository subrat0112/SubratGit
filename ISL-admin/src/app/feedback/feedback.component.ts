import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['../app.component.css']
})
export class FeedbackComponent {

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
  FeedbackText: string;
  FeedbackType: string;
  FeedbackBy: string;
  FeedbackDate: Date;
  selectedSection: string;
  selectedStudents: Student[];
  dataTosend: any;

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {
    this.resetDetails();
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
    this.selectedStudents.push(stu);
  }

  postFeedback() {
    var type = this.FeedbackType;
    if (this.selectedGroup === 'Student') {
      for (const i in this.selectedStudents) {
          if (this.selectedStudents[i]) {
          this.dataTosend = {
            'UID': this.selectedStudents[i].studentId.trim(),
            'Class': 'ALL',
            'Section': 'ALL',
            'FeedbackBy': this.FeedbackBy,
            'FeedbackType': this.FeedbackType,
            'FeedbackDate': this.FeedbackDate,
            'Text': this.FeedbackText
          };
          this.postFeedbackSevice(this.dataTosend).then((res) => {
            this.snackBar.open('Feedback ', 'Sent', {
              duration: 2000
            });
            this.resetDetails();
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
            'FeedbackBy': this.FeedbackBy,
            'FeedbackType': this.FeedbackType,
            'FeedbackDate': this.FeedbackDate,
            'Text': this.FeedbackText
          };
          break;
        case 'Class':
          this.dataTosend = {
            'UID': 'ALL',
            'Class': this.selectedClass.viewValue,
            'Section': 'ALL',
            'FeedbackBy': this.FeedbackBy,
            'FeedbackType': this.FeedbackType,
            'FeedbackDate': this.FeedbackDate,
            'Text': this.FeedbackText
          };
          break;
        case 'ClassSec':
          this.dataTosend = {
            'UID': 'ALL',
            'Class': this.selectedClass.viewValue,
            'Section': this.selectedSection,
            'FeedbackBy': this.FeedbackBy,
            'FeedbackType': this.FeedbackType,
            'FeedbackDate': this.FeedbackDate,
            'Text': this.FeedbackText
          };
          break;
      }
      this.postFeedbackSevice(this.dataTosend).then((res) => {
        this.snackBar.open('Feedback ', 'Sent', {
          duration: 2000,
        });
        this.resetDetails();
      });
    }
  }

  postFeedbackSevice(data) {
    return this.http.post('http://ec2-52-66-139-29.ap-south-1.compute.amazonaws.com:8051/api/UserDetails/PostSchoolFeedback',
    data, { headers: this.headers }).toPromise();
  }

  search(data): Promise<any> {
    return this.http.get('http://ec2-52-66-139-29.ap-south-1.compute.amazonaws.com:8051/'
    + 'api/UserDetails/GetSearchedStudent/' + this.selectedClass.viewValue + '/' + this.selectedSection + '/' + data).toPromise();
  }

  resetDetails(){
    this.selectedClass = this.classes[0];
    this.selectedGroup = 'Student';
    this.FeedbackText = '';
    this.FeedbackType='+';
    this.FeedbackDate=new Date();
    this.FeedbackBy = '';
    this.selectedStudents = [];
    this.searchInput='';
    this.searchedStudents=[];
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