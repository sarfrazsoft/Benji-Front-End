import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantTitleActivityComponent } from './title-activity.component';

describe('ParticipantTitleActivityComponent', () => {
  let component: ParticipantTitleActivityComponent;
  let fixture: ComponentFixture<ParticipantTitleActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantTitleActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantTitleActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
