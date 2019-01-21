import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainscreenElementsComponent } from './mainscreen-elements.component';

describe('MainscreenElementsComponent', () => {
  let component: MainscreenElementsComponent;
  let fixture: ComponentFixture<MainscreenElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainscreenElementsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainscreenElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
