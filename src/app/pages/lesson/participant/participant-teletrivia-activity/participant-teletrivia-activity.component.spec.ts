import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantTeletriviaActivityComponent } from './participant-teletrivia-activity.component';

describe('ParticipantTeletriviaActivityComponent', () => {
  let component: ParticipantTeletriviaActivityComponent;
  let fixture: ComponentFixture<ParticipantTeletriviaActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantTeletriviaActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantTeletriviaActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
