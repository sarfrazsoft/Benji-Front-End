import { TestBed, inject } from '@angular/core/testing';

import { VideoStateService } from './video-state.service';

describe('VideoStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoStateService]
    });
  });

  it('should be created', inject([VideoStateService], (service: VideoStateService) => {
    expect(service).toBeTruthy();
  }));
});
