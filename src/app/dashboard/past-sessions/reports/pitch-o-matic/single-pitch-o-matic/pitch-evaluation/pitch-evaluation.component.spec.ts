import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchEvaluationComponent } from './pitch-evaluation.component';

describe('PitchEvaluationComponent', () => {
  let component: PitchEvaluationComponent;
  let fixture: ComponentFixture<PitchEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitchEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
