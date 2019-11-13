import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriadGroupingActivityComponent } from './triad-grouping-activity.component';

describe('TriadGroupingActivityComponent', () => {
  let component: TriadGroupingActivityComponent;
  let fixture: ComponentFixture<TriadGroupingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriadGroupingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriadGroupingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
