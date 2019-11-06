import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerReportComponent } from './learner-report.component';

describe('LearnerReportComponent', () => {
  let component: LearnerReportComponent;
  let fixture: ComponentFixture<LearnerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
