import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenMontyHallComponent } from './monty-hall.component';

describe('MainScreenMontyHallComponent', () => {
  let component: MainScreenMontyHallComponent;
  let fixture: ComponentFixture<MainScreenMontyHallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenMontyHallComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenMontyHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
