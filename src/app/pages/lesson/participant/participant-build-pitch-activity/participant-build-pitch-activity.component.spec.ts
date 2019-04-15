import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantBuildPitchActivityComponent } from './participant-build-pitch-activity.component';

describe('ParticipantBuildPitchActivityComponent', () => {
  let component: ParticipantBuildPitchActivityComponent;
  let fixture: ComponentFixture<ParticipantBuildPitchActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantBuildPitchActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantBuildPitchActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
