import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseTagsPercentBarsComponent } from './response-tags-percent-bars.component';

describe('ResponseTagsPercentBarsComponent', () => {
  let component: ResponseTagsPercentBarsComponent;
  let fixture: ComponentFixture<ResponseTagsPercentBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResponseTagsPercentBarsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseTagsPercentBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
