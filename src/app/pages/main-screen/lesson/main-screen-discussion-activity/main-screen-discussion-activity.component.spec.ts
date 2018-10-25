import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenDiscussionActivityComponent } from './main-screen-discussion-activity.component';

describe('MainScreenDiscussionActivityComponent', () => {
  let component: MainScreenDiscussionActivityComponent;
  let fixture: ComponentFixture<MainScreenDiscussionActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScreenDiscussionActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenDiscussionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
