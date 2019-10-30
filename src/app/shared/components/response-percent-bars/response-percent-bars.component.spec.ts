import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsePercentBarsComponent } from './response-percent-bars.component';

describe('ResponsePercentBarsComponent', () => {
  let component: ResponsePercentBarsComponent;
  let fixture: ComponentFixture<ResponsePercentBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsePercentBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsePercentBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
