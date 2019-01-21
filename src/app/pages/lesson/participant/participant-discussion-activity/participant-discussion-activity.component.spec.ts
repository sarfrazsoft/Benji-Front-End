import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantDiscussionActivityComponent } from './participant-discussion-activity.component';

describe('ParticipantDiscussionActivityComponent', () => {
  let component: ParticipantDiscussionActivityComponent;
  let fixture: ComponentFixture<ParticipantDiscussionActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantDiscussionActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantDiscussionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
