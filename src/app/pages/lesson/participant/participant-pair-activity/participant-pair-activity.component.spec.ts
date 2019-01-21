import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPairActivityComponent } from './participant-pair-activity.component';

describe('ParticipantPairActivityComponent', () => {
  let component: ParticipantPairActivityComponent;
  let fixture: ComponentFixture<ParticipantPairActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantPairActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantPairActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
