import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySelectorPanelComponent } from './activity-selector-panel.component';

describe('ActivitySelectorPanelComponent', () => {
  let component: ActivitySelectorPanelComponent;
  let fixture: ComponentFixture<ActivitySelectorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySelectorPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySelectorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
