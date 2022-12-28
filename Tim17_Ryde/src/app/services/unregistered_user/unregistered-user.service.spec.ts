import { TestBed } from '@angular/core/testing';

import { UnregisteredUserService } from './unregistered-user.service';

describe('UnregisteredUserService', () => {
  let service: UnregisteredUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnregisteredUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
