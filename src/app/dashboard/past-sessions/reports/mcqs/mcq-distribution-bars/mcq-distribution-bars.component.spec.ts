import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McqDistributionBarsComponent } from './mcq-distribution-bars.component';

describe('McqDistributionBarsComponent', () => {
  let component: McqDistributionBarsComponent;
  let fixture: ComponentFixture<McqDistributionBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McqDistributionBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqDistributionBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
