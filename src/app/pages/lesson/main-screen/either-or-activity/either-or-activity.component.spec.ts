import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenEitherOrActivityComponent } from './either-or-activity.component';

describe('MainScreenEitherOrActivityComponent', () => {
  let component: MainScreenEitherOrActivityComponent;
  let fixture: ComponentFixture<MainScreenEitherOrActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenEitherOrActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenEitherOrActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
