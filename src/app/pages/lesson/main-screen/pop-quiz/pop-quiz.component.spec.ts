import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenPopQuizComponent } from './pop-quiz.component';

describe('MainScreenPopQuizComponent', () => {
  let component: MainScreenPopQuizComponent;
  let fixture: ComponentFixture<MainScreenPopQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenPopQuizComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenPopQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
