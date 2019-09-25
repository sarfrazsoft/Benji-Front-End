import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenBrainstormingActivityComponent } from './brainstorming-activity.component';

describe('MainScreenBrainstormingActivityComponent', () => {
  let component: MainScreenBrainstormingActivityComponent;
  let fixture: ComponentFixture<MainScreenBrainstormingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenBrainstormingActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenBrainstormingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
