import 'chart.js/auto';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideCharts } from 'ng2-charts';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(Array.isArray((appConfig as any).providers) ? (appConfig as any).providers : []),
    provideCharts(),
    provideHttpClient(withFetch())
  ]
}).catch(err => console.error(err));