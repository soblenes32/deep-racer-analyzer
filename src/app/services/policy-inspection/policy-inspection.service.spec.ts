import { TestBed } from '@angular/core/testing';

import { PolicyInspectionService } from './policy-inspection.service';

describe('PolicyInspectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolicyInspectionService = TestBed.get(PolicyInspectionService);
    expect(service).toBeTruthy();
  });
});
