import { TestBed, inject } from '@angular/core/testing';

import { TagApiGatewayService } from './tag-api-gateway.service';

describe('TagApiGatewayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagApiGatewayService]
    });
  });

  it('should be created', inject([TagApiGatewayService], (service: TagApiGatewayService) => {
    expect(service).toBeTruthy();
  }));
});
