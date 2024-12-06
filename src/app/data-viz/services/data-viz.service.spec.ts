import { TestBed } from '@angular/core/testing';

import { DataVizService } from './data-viz.service';

describe('DataVizService', () => {
  let service: DataVizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataVizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
