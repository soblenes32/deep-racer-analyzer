import { TestBed } from '@angular/core/testing';

import { LogTreeNodeDatabaseService } from './log-tree-node-database.service';

describe('LogTreeNodeDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogTreeNodeDatabaseService = TestBed.get(LogTreeNodeDatabaseService);
    expect(service).toBeTruthy();
  });
});
