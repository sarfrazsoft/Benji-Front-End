import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyActivityComponent } from './case-study-activity.component';

describe('CaseStudyActivityComponent', () => {
  let component: CaseStudyActivityComponent;
  let fixture: ComponentFixture<CaseStudyActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseStudyActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
