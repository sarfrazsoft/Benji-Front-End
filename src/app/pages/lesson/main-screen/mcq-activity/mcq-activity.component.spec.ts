import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenMcqActivityComponent } from './mcq-activity.component';

describe('MainScreenMcqActivityComponent', () => {
  let component: MainScreenMcqActivityComponent;
  let fixture: ComponentFixture<MainScreenMcqActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenMcqActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenMcqActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
