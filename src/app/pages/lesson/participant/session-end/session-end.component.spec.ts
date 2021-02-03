import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEndComponent } from './session-end.component';

describe('SessionEndComponent', () => {
  let component: SessionEndComponent;
  let fixture: ComponentFixture<SessionEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionEndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
