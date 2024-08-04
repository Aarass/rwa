import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';

describe.only('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();

    await service.register();
  });
});
