import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenConvoCardsActivityComponent } from './convo-cards-activity.component';

describe('MainScreenConvoCardsActivityComponent', () => {
  let component: MainScreenConvoCardsActivityComponent;
  let fixture: ComponentFixture<MainScreenConvoCardsActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainScreenConvoCardsActivityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenConvoCardsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
