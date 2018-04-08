import { TestBed, inject } from '@angular/core/testing';

import { TagDynamodbService } from './tag-dynamodb.service';

describe('TagDynamodbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagDynamodbService]
    });
  });

  it('should be created', inject([TagDynamodbService], (service: TagDynamodbService) => {
    expect(service).toBeTruthy();
  }));
});
