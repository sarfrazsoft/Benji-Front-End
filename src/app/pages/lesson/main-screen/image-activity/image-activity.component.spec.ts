import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenImageActivityComponent } from './image-activity.component';

describe('MainScreenImageActivityComponent', () => {
  let component: MainScreenImageActivityComponent;
  let fixture: ComponentFixture<MainScreenImageActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenImageActivityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenImageActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
