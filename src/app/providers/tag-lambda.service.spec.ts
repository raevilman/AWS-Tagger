import { TestBed, inject } from '@angular/core/testing';

import { TagLambdaService } from './tag-lambda.service';

describe('TagLambdaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagLambdaService]
    });
  });

  it('should be created', inject([TagLambdaService], (service: TagLambdaService) => {
    expect(service).toBeTruthy();
  }));
});
