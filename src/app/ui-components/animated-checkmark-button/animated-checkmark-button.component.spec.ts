import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedCheckmarkButtonComponent } from './animated-checkmark-button.component';

describe('AnimatedCheckmarkButtonComponent', () => {
  let component: AnimatedCheckmarkButtonComponent;
  let fixture: ComponentFixture<AnimatedCheckmarkButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedCheckmarkButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedCheckmarkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
