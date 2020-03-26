import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentionOverlayComponent } from './attention-overlay.component';

describe('AttentionOverlayComponent', () => {
  let component: AttentionOverlayComponent;
  let fixture: ComponentFixture<AttentionOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttentionOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttentionOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
