import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyActivityComponent } from './lobby-activity.component';

describe('LobbyActivityComponent', () => {
  let component: LobbyActivityComponent;
  let fixture: ComponentFixture<LobbyActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
