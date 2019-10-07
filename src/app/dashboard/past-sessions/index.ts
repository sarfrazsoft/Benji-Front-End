export * from './services/past-sessions.service';

import { PastSessionsComponent } from './past-sessions.component';
import { AssessmentBarComponent } from './reports/assessment-bar/assessment-bar.component';
import { BuildAPitchComponent as BAPReportComponent } from './reports/build-a-pitch/build-a-pitch.component';
import { McqDistributionBarsComponent } from './reports/mcqs/mcq-distribution-bars/mcq-distribution-bars.component';
import { McqTableComponent } from './reports/mcqs/mcq-table/mcq-table.component';
import { McqsComponent } from './reports/mcqs/mcqs.component';
import { ReportsComponent } from './reports/reports.component';
import { PastSessionsService } from './services/past-sessions.service';
export { PastSessionsComponent, ReportsComponent };

export const PastSessionsComponents = [
  PastSessionsComponent,
  ReportsComponent,
  BAPReportComponent,
  AssessmentBarComponent,
  McqsComponent,
  McqDistributionBarsComponent,
  McqTableComponent
];

export const PastSessionsEntryComponents = [];

export const PastSessionsProviders = [PastSessionsService];
