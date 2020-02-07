import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRoleplayComponent } from './generic-roleplay.component';

describe('GenericRoleplayComponent', () => {
  let component: GenericRoleplayComponent;
  let fixture: ComponentFixture<GenericRoleplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericRoleplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericRoleplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
