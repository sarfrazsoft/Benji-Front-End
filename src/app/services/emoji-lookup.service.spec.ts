import { inject, TestBed } from '@angular/core/testing';

import { EmojiLookupService } from './emoji-lookup.service';

describe('EmojiLookupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmojiLookupService]
    });
  });

  it('should be created', inject(
    [EmojiLookupService],
    (service: EmojiLookupService) => {
      expect(service).toBeTruthy();
    }
  ));
});
