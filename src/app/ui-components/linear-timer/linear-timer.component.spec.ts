import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearTimerComponent } from './linear-timer.component';

describe('LinearTimerComponent', () => {
  let component: LinearTimerComponent;
  let fixture: ComponentFixture<LinearTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
