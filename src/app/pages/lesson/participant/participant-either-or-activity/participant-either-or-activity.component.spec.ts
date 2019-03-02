import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantEitherOrActivityComponent } from './participant-either-or-activity.component';

describe('ParticipantEitherOrActivityComponent', () => {
  let component: ParticipantEitherOrActivityComponent;
  let fixture: ComponentFixture<ParticipantEitherOrActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantEitherOrActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantEitherOrActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
