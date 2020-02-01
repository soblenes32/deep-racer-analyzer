import { TestBed } from '@angular/core/testing';

import { RacetrackService } from './racetrack.service';

describe('RacetrackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RacetrackService = TestBed.get(RacetrackService);
    expect(service).toBeTruthy();
  });
});
