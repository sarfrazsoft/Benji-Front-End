import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantLobbyComponent } from './lobby.component';

describe('ParticipantLobbyComponent', () => {
  let component: ParticipantLobbyComponent;
  let fixture: ComponentFixture<ParticipantLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantLobbyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
