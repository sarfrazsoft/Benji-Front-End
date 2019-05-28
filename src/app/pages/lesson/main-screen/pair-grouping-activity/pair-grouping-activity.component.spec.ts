import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenPairGroupingActivityComponent } from './pair-grouping-activity.component';

describe('MainScreenPairGroupingActivityComponent', () => {
  let component: MainScreenPairGroupingActivityComponent;
  let fixture: ComponentFixture<MainScreenPairGroupingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenPairGroupingActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenPairGroupingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
