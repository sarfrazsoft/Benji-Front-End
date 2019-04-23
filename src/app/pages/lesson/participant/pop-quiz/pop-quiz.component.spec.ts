import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPopQuizComponent } from './pop-quiz.component';

describe('ParticipantPopQuizComponent', () => {
  let component: ParticipantPopQuizComponent;
  let fixture: ComponentFixture<ParticipantPopQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantPopQuizComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantPopQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
