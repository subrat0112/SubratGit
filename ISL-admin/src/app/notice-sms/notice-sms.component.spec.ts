import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeSMSComponent } from './notice-sms.component';

describe('NoticeSMSComponent', () => {
  let component: NoticeSMSComponent;
  let fixture: ComponentFixture<NoticeSMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeSMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
