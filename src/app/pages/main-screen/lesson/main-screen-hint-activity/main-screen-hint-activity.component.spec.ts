import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenHintActivityComponent } from './main-screen-hint-activity.component';

describe('MainScreenHintActivityComponent', () => {
  let component: MainScreenHintActivityComponent;
  let fixture: ComponentFixture<MainScreenHintActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScreenHintActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenHintActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
