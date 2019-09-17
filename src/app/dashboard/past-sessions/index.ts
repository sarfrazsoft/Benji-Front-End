export * from './services/past-sessions.service';

import { PastSessionsComponent } from './past-sessions.component';
import { BuildAPitchComponent as BAPReportComponent } from './reports/build-a-pitch/build-a-pitch.component';
import { ReportsComponent } from './reports/reports.component';
import { PastSessionsService } from './services/past-sessions.service';
export { PastSessionsComponent, ReportsComponent };

export const PastSessionsComponents = [
  PastSessionsComponent,
  ReportsComponent,
  BAPReportComponent
];

export const PastSessionsEntryComponents = [];

export const PastSessionsProviders = [PastSessionsService];
