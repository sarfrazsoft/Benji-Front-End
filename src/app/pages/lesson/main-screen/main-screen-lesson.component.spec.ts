import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenLessonComponent } from './main-screen-lesson.component';

describe('MainScreenLessonComponent', () => {
  let component: MainScreenLessonComponent;
  let fixture: ComponentFixture<MainScreenLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenLessonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
