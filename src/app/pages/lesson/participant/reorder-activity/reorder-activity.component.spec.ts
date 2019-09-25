import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantReorderActivityComponent } from './reorder-activity.component';

describe('BrainstormingActivityComponent', () => {
  let component: ParticipantReorderActivityComponent;
  let fixture: ComponentFixture<ParticipantReorderActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantReorderActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantReorderActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
