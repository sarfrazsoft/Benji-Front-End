import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTagsComponent } from './feedback-tags.component';

describe('FeedbackTagsComponent', () => {
  let component: FeedbackTagsComponent;
  let fixture: ComponentFixture<FeedbackTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
