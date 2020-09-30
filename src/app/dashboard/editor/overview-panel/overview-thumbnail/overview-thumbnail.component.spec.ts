import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewThumbnailComponent } from './overview-thumbnail.component';

describe('OverviewThumbnailComponent', () => {
  let component: OverviewThumbnailComponent;
  let fixture: ComponentFixture<OverviewThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewThumbnailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
