import { TestBed } from '@angular/core/testing';

import { FeaturedRaceService } from './featured-race.service';

describe('FeaturedRaceService', () => {
  let service: FeaturedRaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedRaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
