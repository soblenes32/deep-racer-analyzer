import { TestBed } from '@angular/core/testing';

import { MobileRouteGuardService } from './mobile-route-guard.service';

describe('MobileRouteGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MobileRouteGuardService = TestBed.get(MobileRouteGuardService);
    expect(service).toBeTruthy();
  });
});
