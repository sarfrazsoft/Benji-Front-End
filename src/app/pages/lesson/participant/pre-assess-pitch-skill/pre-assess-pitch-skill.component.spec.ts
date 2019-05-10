import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPreAssessPitchSkillComponent } from './pre-assess-pitch-skill.component';

describe('ParticipantPreAssessPitchSkillComponent', () => {
  let component: ParticipantPreAssessPitchSkillComponent;
  let fixture: ComponentFixture<ParticipantPreAssessPitchSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantPreAssessPitchSkillComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantPreAssessPitchSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
