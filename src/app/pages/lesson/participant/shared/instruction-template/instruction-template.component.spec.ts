import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantInstructionTemplateComponent } from './instruction-template.component';

describe('ParticipantInstructionnTemplateComponent', () => {
  let component: ParticipantInstructionTemplateComponent;
  let fixture: ComponentFixture<ParticipantInstructionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantInstructionTemplateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantInstructionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
