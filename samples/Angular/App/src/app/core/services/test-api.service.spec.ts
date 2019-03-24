import { TestBed, inject } from '@angular/core/testing';

import { TestApiService } from './test-api.service';

describe('TestApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestApiService]
    });
  });

  it('should be created', inject([TestApiService], (service: TestApiService) => {
    expect(service).toBeTruthy();
  }));
});
