import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentBarComponent } from './assessment-bar.component';

describe('AssessmentBarComponent', () => {
  let component: AssessmentBarComponent;
  let fixture: ComponentFixture<AssessmentBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
