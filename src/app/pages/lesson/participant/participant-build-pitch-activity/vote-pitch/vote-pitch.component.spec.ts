import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePitchComponent } from './vote-pitch.component';

describe('VotePitchComponent', () => {
  let component: VotePitchComponent;
  let fixture: ComponentFixture<VotePitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotePitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotePitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
