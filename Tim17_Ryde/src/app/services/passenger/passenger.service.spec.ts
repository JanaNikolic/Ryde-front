import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PassengerService } from './passenger.service';
import { mockPassenger1 } from 'src/app/mocks/passenger.service.mock';

describe('PassengerService', () => {
  let service: PassengerService;
  let httpController: HttpTestingController;
  let url = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PassengerService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call add passenger and the API should return the passenger that was added', () => {
    service.add(mockPassenger1).subscribe((data) => {
      expect(data).toEqual(mockPassenger1);
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${url}/passenger`,
    });

    req.flush(mockPassenger1);
  });
});