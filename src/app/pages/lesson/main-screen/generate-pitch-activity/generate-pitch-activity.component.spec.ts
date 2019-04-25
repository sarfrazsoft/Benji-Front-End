import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenGeneratePitchActivityComponent } from './generate-pitch-activity.component';

describe('GeneratePitchActivityComponent', () => {
  let component: MainScreenGeneratePitchActivityComponent;
  let fixture: ComponentFixture<MainScreenGeneratePitchActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenGeneratePitchActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenGeneratePitchActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
