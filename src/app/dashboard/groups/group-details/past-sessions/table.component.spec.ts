import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastSessionsTableComponent } from './table.component';

describe('PastSessionsTableComponent', () => {
  let component: PastSessionsTableComponent;
  let fixture: ComponentFixture<PastSessionsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PastSessionsTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastSessionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
