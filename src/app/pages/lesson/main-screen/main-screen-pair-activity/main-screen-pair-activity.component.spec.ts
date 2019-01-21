import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenPairActivityComponent } from './main-screen-pair-activity.component';

describe('MainScreenPairActivityComponent', () => {
  let component: MainScreenPairActivityComponent;
  let fixture: ComponentFixture<MainScreenPairActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenPairActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenPairActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
