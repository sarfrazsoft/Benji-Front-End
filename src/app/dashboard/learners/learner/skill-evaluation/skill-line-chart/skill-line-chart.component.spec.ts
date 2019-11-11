import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillLineChartComponent } from './skill-line-chart.component';

describe('SkillLineChartComponent', () => {
  let component: SkillLineChartComponent;
  let fixture: ComponentFixture<SkillLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkillLineChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
