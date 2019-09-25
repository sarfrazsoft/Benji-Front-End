import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainstormingActivityComponent } from './brainstorming-activity.component';

describe('BrainstormingActivityComponent', () => {
  let component: BrainstormingActivityComponent;
  let fixture: ComponentFixture<BrainstormingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrainstormingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainstormingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
