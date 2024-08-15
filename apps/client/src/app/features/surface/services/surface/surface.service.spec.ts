import { TestBed } from '@angular/core/testing';

import { SurfaceService } from './surface.service';

describe('SurfaceService', () => {
  let service: SurfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
