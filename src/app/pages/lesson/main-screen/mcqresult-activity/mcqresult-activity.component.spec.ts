import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenMcqresultActivityComponent } from './mcqresult-activity.component';

describe('MainScreenMcqresultActivityComponent', () => {
  let component: MainScreenMcqresultActivityComponent;
  let fixture: ComponentFixture<MainScreenMcqresultActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenMcqresultActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenMcqresultActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
