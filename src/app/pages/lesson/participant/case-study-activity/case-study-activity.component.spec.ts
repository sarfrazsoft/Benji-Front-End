import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCaseStudyActivityComponent } from './case-study-activity.component';

describe('ParticipantCaseStudyActivityComponent', () => {
  let component: ParticipantCaseStudyActivityComponent;
  let fixture: ComponentFixture<ParticipantCaseStudyActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantCaseStudyActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantCaseStudyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
