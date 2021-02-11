import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvoCardsActivityComponent } from './convo-cards-activity.component';

describe('ConvoCardsActivityComponent', () => {
  let component: ConvoCardsActivityComponent;
  let fixture: ComponentFixture<ConvoCardsActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvoCardsActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvoCardsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
