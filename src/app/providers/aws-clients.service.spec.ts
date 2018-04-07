import { TestBed, inject } from '@angular/core/testing';

import { AwsClientsService } from './aws-clients.service';

describe('AwsClientsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AwsClientsService]
    });
  });

  it('should be created', inject([AwsClientsService], (service: AwsClientsService) => {
    expect(service).toBeTruthy();
  }));
});
