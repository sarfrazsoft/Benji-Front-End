import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAssessPitchSkillComponent } from './post-assess-pitch-skill.component';

describe('PostAssessPitchSkillComponent', () => {
  let component: PostAssessPitchSkillComponent;
  let fixture: ComponentFixture<PostAssessPitchSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostAssessPitchSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostAssessPitchSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
