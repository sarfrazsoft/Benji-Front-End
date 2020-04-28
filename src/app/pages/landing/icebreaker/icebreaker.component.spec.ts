import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcebreakerComponent } from './icebreaker.component';

describe('IcebreakerComponent', () => {
  let component: IcebreakerComponent;
  let fixture: ComponentFixture<IcebreakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcebreakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcebreakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
