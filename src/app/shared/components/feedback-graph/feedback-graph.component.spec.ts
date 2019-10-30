import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackGraphComponent } from './feedback-graph.component';

describe('FeedbackGraphComponent', () => {
  let component: FeedbackGraphComponent;
  let fixture: ComponentFixture<FeedbackGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
