import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mockLogin } from 'src/app/mocks/login.service.mock';
import { JwtAuthenticationRequest } from 'src/app/model/JwtAuthenticationRequest';

import { AuthService } from '../auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let url = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login and the API should return token', () => {
    const user: JwtAuthenticationRequest = {
      email: "neca@perovic.com",
      password: "Pasword123"
  }
    service.login(user).subscribe((data) => {
      expect(data).toEqual(mockLogin);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/user/login`,
    });

    req.flush(mockLogin);
  });
});
