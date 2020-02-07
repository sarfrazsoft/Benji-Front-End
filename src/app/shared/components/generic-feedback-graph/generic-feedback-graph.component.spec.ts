import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackGenericGraphComponent } from './generic-feedback-graph.component';

describe('FeedbackGenericGraphComponent', () => {
  let component: FeedbackGenericGraphComponent;
  let fixture: ComponentFixture<FeedbackGenericGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackGenericGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackGenericGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
