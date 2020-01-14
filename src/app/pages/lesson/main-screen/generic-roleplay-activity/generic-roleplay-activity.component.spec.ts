import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRoleplayActivityComponent } from './generic-roleplay-activity.component';

describe('GenericRoleplayActivityComponent', () => {
  let component: GenericRoleplayActivityComponent;
  let fixture: ComponentFixture<GenericRoleplayActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericRoleplayActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericRoleplayActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
