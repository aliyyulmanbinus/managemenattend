import { ResolveFn } from '@angular/router';

export const welcomeResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
