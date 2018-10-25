import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenFeedbackActivityComponent } from './main-screen-feedback-activity.component';

describe('MainScreenFeedbackActivityComponent', () => {
  let component: MainScreenFeedbackActivityComponent;
  let fixture: ComponentFixture<MainScreenFeedbackActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScreenFeedbackActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenFeedbackActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
