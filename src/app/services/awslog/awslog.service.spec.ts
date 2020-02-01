import { TestBed } from '@angular/core/testing';

import { AwslogService } from './awslog.service';

describe('AwslogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AwslogService = TestBed.get(AwslogService);
    expect(service).toBeTruthy();
  });
});
