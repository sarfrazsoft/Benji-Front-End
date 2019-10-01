import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McqTableComponent } from './mcq-table.component';

describe('McqTableComponent', () => {
  let component: McqTableComponent;
  let fixture: ComponentFixture<McqTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McqTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
