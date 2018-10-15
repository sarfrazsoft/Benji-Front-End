import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenFooterComponent } from './main-screen-footer.component';

describe('MainScreenFooterComponent', () => {
  let component: MainScreenFooterComponent;
  let fixture: ComponentFixture<MainScreenFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScreenFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
