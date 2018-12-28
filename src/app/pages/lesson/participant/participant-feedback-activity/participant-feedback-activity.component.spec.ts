import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantFeedbackActivityComponent } from './participant-feedback-activity.component';

describe('ParticipantFeedbackActivityComponent', () => {
  let component: ParticipantFeedbackActivityComponent;
  let fixture: ComponentFixture<ParticipantFeedbackActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantFeedbackActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantFeedbackActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
