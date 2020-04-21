import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatherActivityComponent } from './gather-activity.component';

describe('GatherActivityComponent', () => {
  let component: GatherActivityComponent;
  let fixture: ComponentFixture<GatherActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatherActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatherActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
