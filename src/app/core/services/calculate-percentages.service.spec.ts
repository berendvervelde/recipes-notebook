import { TestBed } from '@angular/core/testing';

import { CalculatePercentagesService } from './calculate-percentages.service';

describe('CalculatePercentagesService', () => {
  let service: CalculatePercentagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatePercentagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
