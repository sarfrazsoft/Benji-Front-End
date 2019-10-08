export * from './services/past-sessions.service';

import { PastSessionsComponent } from './past-sessions.component';
import { BuildAPitchComponent as BAPReportComponent } from './reports/build-a-pitch/build-a-pitch.component';
import { McqTableComponent } from './reports/mcqs/mcq-table/mcq-table.component';
import { McqsComponent } from './reports/mcqs/mcqs.component';
import { OptionDistributionBarsComponent } from './reports/mcqs/option-distribution-bars/option-distribution-bars.component';
import { OptionSpreadComponent } from './reports/mcqs/option-spread/option-spread.component';
import { ReportsComponent } from './reports/reports.component';
import { AssessmentBarComponent } from './reports/shared/assessment-bar/assessment-bar.component';
import { ResponsePercentBarsComponent } from './reports/shared/response-percent-bars/response-percent-bars.component';
import { PastSessionsService } from './services/past-sessions.service';
export { PastSessionsComponent, ReportsComponent };

export const PastSessionsComponents = [
  PastSessionsComponent,
  ReportsComponent,
  BAPReportComponent,
  AssessmentBarComponent,
  ResponsePercentBarsComponent,
  McqsComponent,
  OptionSpreadComponent,
  OptionDistributionBarsComponent,
  McqTableComponent
];

export const PastSessionsEntryComponents = [];

export const PastSessionsProviders = [PastSessionsService];
