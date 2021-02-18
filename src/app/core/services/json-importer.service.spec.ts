import { TestBed } from '@angular/core/testing';

import { JsonImporterService } from './json-importer.service';

describe('JsonImporterService', () => {
  let service: JsonImporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonImporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
