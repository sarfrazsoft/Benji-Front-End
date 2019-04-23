import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenTitleActivityComponent } from './title-activity.component';

describe('MainScreenTitleActivityComponent', () => {
  let component: MainScreenTitleActivityComponent;
  let fixture: ComponentFixture<MainScreenTitleActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenTitleActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenTitleActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
