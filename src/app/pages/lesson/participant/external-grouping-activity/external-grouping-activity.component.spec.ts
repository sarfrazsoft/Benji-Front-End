import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantExternalGroupingActivityComponent } from './external-grouping-activity.component';

describe('ParticipantExternalGroupingActivityComponent', () => {
  let component: ParticipantExternalGroupingActivityComponent;
  let fixture: ComponentFixture<ParticipantExternalGroupingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantExternalGroupingActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ParticipantExternalGroupingActivityComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
