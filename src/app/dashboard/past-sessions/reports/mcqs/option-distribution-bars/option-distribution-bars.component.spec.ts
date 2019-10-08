import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionDistributionBarsComponent } from './option-distribution-bars.component';

describe('OptionDistributionBarsComponent', () => {
  let component: OptionDistributionBarsComponent;
  let fixture: ComponentFixture<OptionDistributionBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionDistributionBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionDistributionBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
