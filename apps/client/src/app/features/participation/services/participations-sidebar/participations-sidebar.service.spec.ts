import { TestBed } from '@angular/core/testing';

import { ParticipationsSidebarService } from './participations-sidebar.service';

describe('ParticipationsSidebarService', () => {
  let service: ParticipationsSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipationsSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
