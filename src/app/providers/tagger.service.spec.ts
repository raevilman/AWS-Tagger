import { TestBed, inject } from '@angular/core/testing';

import { TaggerService } from './tagger.service';

describe('TaggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaggerService]
    });
  });

  it('should be created', inject([TaggerService], (service: TaggerService) => {
    expect(service).toBeTruthy();
  }));
});
