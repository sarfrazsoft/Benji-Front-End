import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPairGroupingActivityComponent } from './pair-grouping-activity.component';

describe('ParticipantPairGroupingActivityComponent', () => {
  let component: ParticipantPairGroupingActivityComponent;
  let fixture: ComponentFixture<ParticipantPairGroupingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantPairGroupingActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantPairGroupingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
