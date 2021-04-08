import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantToolbarComponent } from './participant-toolbar.component';

describe('ParticipantToolbarComponent', () => {
  let component: ParticipantToolbarComponent;
  let fixture: ComponentFixture<ParticipantToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
