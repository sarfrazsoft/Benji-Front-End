import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantHintActivityComponent } from './participant-hint-activity.component';

describe('ParticipantHintActivityComponent', () => {
  let component: ParticipantHintActivityComponent;
  let fixture: ComponentFixture<ParticipantHintActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantHintActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantHintActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
