import { TestBed } from '@angular/core/testing';

import { EmployeeData } from './employee-data';

describe('EmployeeData', () => {
  let service: EmployeeData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
