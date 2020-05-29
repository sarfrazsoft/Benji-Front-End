import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantMontyHallActivityComponent } from './monty-hall-activity.component';

describe('MontyHallActivityComponent', () => {
  let component: ParticipantMontyHallActivityComponent;
  let fixture: ComponentFixture<ParticipantMontyHallActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantMontyHallActivityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantMontyHallActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
