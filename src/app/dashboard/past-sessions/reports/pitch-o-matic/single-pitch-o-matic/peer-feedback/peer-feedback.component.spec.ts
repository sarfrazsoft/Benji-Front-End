import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerFeedbackComponent } from './peer-feedback.component';

describe('PeerFeedbackComponent', () => {
  let component: PeerFeedbackComponent;
  let fixture: ComponentFixture<PeerFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
