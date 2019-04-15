import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenBuildPitchActivityComponent } from './main-screen-build-pitch-activity.component';

describe('MainScreenBuildPitchActivityComponent', () => {
  let component: MainScreenBuildPitchActivityComponent;
  let fixture: ComponentFixture<MainScreenBuildPitchActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScreenBuildPitchActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenBuildPitchActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
