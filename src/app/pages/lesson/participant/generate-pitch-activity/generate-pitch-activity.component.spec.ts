import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantGeneratePitchActivityComponent } from './generate-pitch-activity.component';

describe('ParticipantGeneratePitchActivityComponent', () => {
  let component: ParticipantGeneratePitchActivityComponent;
  let fixture: ComponentFixture<ParticipantGeneratePitchActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantGeneratePitchActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ParticipantGeneratePitchActivityComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
