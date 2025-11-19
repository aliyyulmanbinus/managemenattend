import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  // dashboard router
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/pages/welcome/welcome').then(m => m.WelcomeComponent)
  },

  //monitor router
  {
    path: 'monitor',
    loadComponent: () => import('./report-auto/monitor/monitor').then(m => m.MonitorComponent)
  },

  // fallback
  { path: '**', redirectTo: 'dashboard' }
];

