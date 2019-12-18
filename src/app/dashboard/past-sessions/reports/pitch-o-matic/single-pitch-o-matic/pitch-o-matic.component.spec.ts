import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchOMaticComponent } from './pitch-o-matic.component';

describe('PitchOMaticComponent', () => {
  let component: PitchOMaticComponent;
  let fixture: ComponentFixture<PitchOMaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitchOMaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchOMaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
