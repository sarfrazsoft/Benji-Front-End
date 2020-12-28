import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyGroupComponent } from './case-study-group.component';

describe('CaseStudyGroupComponent', () => {
  let component: CaseStudyGroupComponent;
  let fixture: ComponentFixture<CaseStudyGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseStudyGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
