import { TestBed } from '@angular/core/testing';

import { PlotPresentationService } from './plot-presentation.service';

describe('PlotPresentationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlotPresentationService = TestBed.get(PlotPresentationService);
    expect(service).toBeTruthy();
  });
});
