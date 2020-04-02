import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalGroupingActivityComponent } from './external-grouping-activity.component';

describe('ExternalGroupingActivityComponent', () => {
  let component: ExternalGroupingActivityComponent;
  let fixture: ComponentFixture<ExternalGroupingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalGroupingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalGroupingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
