import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantLessonComponent } from './participant-lesson.component';

describe('ParticipantLessonComponent', () => {
  let component: ParticipantLessonComponent;
  let fixture: ComponentFixture<ParticipantLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
