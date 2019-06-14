import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLearnersComponent } from './add-learners.component';

describe('AddLearnersComponent', () => {
  let component: AddLearnersComponent;
  let fixture: ComponentFixture<AddLearnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLearnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLearnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
