import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { welcomeResolver } from './welcome-resolver';

describe('welcomeResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => welcomeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
