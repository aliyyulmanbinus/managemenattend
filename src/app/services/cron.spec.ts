import { TestBed } from '@angular/core/testing';

import { Cron } from './cron';

describe('Cron', () => {
  let service: Cron;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cron);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
