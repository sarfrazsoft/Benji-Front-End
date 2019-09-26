export * from './services/past-sessions.service';

import { PastSessionsComponent } from './past-sessions.component';
import { AssessmentBarComponent } from './reports/assessment-bar/assessment-bar.component';
import { BuildAPitchComponent as BAPReportComponent } from './reports/build-a-pitch/build-a-pitch.component';
import { ReportsComponent } from './reports/reports.component';
import { PastSessionsService } from './services/past-sessions.service';
export { PastSessionsComponent, ReportsComponent };

export const PastSessionsComponents = [
  PastSessionsComponent,
  ReportsComponent,
  BAPReportComponent,
  AssessmentBarComponent
];

export const PastSessionsEntryComponents = [];

export const PastSessionsProviders = [PastSessionsService];
