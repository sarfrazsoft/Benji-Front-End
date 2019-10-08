import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionSpreadComponent } from './option-spread.component';

describe('OptionSpreadComponent', () => {
  let component: OptionSpreadComponent;
  let fixture: ComponentFixture<OptionSpreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OptionSpreadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionSpreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
