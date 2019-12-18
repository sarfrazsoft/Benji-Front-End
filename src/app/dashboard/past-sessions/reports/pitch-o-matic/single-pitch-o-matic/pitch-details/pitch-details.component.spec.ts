import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchDetailsComponent } from './pitch-details.component';

describe('PitchDetailsComponent', () => {
  let component: PitchDetailsComponent;
  let fixture: ComponentFixture<PitchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
