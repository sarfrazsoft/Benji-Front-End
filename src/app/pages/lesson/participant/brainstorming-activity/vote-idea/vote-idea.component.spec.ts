import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteIdeaComponent } from './vote-idea.component';

describe('VoteIdeaComponent', () => {
  let component: VoteIdeaComponent;
  let fixture: ComponentFixture<VoteIdeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VoteIdeaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
