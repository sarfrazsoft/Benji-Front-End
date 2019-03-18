import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BTwemojiComponent } from './b-twemoji.component';

describe('BTwemojiComponent', () => {
  let component: BTwemojiComponent;
  let fixture: ComponentFixture<BTwemojiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BTwemojiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BTwemojiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
