import { TestBed, inject } from '@angular/core/testing';

import { AppAuthNService } from './app-auth-n.service';

describe('AppAuthNService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppAuthNService]
    });
  });

  it('should be created', inject([AppAuthNService], (service: AppAuthNService) => {
    expect(service).toBeTruthy();
  }));
});
