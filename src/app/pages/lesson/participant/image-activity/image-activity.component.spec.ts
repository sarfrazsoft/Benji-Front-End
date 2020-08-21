import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantImageActivityComponent } from './image-activity.component';

describe('ParticipantImageActivityComponent', () => {
  let component: ParticipantImageActivityComponent;
  let fixture: ComponentFixture<ParticipantImageActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipantImageActivityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantImageActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
