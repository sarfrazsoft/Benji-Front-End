import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildAPitchComponent } from './build-a-pitch.component';

describe('BuildAPitchComponent', () => {
  let component: BuildAPitchComponent;
  let fixture: ComponentFixture<BuildAPitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildAPitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildAPitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
