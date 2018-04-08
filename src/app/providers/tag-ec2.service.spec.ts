import { TestBed, inject } from '@angular/core/testing';

import { TagEc2Service } from './tag-ec2.service';

describe('TagEc2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagEc2Service]
    });
  });

  it('should be created', inject([TagEc2Service], (service: TagEc2Service) => {
    expect(service).toBeTruthy();
  }));
});
