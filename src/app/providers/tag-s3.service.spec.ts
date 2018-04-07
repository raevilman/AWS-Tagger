import { TestBed, inject } from '@angular/core/testing';

import { TagS3Service } from './tag-s3.service';

describe('TagS3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagS3Service]
    });
  });

  it('should be created', inject([TagS3Service], (service: TagS3Service) => {
    expect(service).toBeTruthy();
  }));
});
