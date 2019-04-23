import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantMcqActivityComponent } from './mcq-activity.component';

describe('ParticipantMcqActivityComponent', () => {
  let component: ParticipantMcqActivityComponent;
  let fixture: ComponentFixture<ParticipantMcqActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantMcqActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantMcqActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
