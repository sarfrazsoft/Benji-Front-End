import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantMcqresultActivityComponent } from './mcqresult-activity.component';

describe('ParticipantMcqresultActivityComponent', () => {
  let component: ParticipantMcqresultActivityComponent;
  let fixture: ComponentFixture<ParticipantMcqresultActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantMcqresultActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantMcqresultActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
