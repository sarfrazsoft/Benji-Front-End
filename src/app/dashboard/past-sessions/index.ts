import { PastSessionsComponent } from './past-sessions.component';
import { BrainStormComponent } from './reports/brain-storm/brain-storm.component';
import { BuildAPitchComponent as BAPReportComponent } from './reports/build-a-pitch/build-a-pitch.component';
import { FeedbackTagsComponent } from './reports/feedback-tags/feedback-tags.component';
import { FeedbackComponent } from './reports/feedback/feedback.component';
import { GenericRoleplayComponent } from './reports/generic-roleplay/generic-roleplay.component';
import { KeyStatsComponent } from './reports/key-stats/key-stats.component';
import { ParticipantsComponent } from './reports/key-stats/participants/participants.component';
import { McqTableComponent } from './reports/mcqs/mcq-table/mcq-table.component';
import { McqsComponent } from './reports/mcqs/mcqs.component';
import { OptionDistributionBarsComponent } from './reports/mcqs/option-distribution-bars/option-distribution-bars.component';
import { OptionSpreadComponent } from './reports/mcqs/option-spread/option-spread.component';
import {
  LearnerReportComponents,
  LearnerReportEntryComponents
} from './reports/pitch-o-matic/index';
import { PitchOMaticComponent } from './reports/pitch-o-matic/pitch-o-matic.component';
import { ReportsComponent } from './reports/reports.component';
import { PastSessionsTableComponent } from './table/table.component';

export { PastSessionsComponent, ReportsComponent };

export const PastSessionsComponents = [
  ...LearnerReportComponents,
  PastSessionsComponent,
  PastSessionsTableComponent,
  ReportsComponent,
  BAPReportComponent,
  McqsComponent,
  OptionSpreadComponent,
  OptionDistributionBarsComponent,
  McqTableComponent,
  BrainStormComponent,
  KeyStatsComponent,
  ParticipantsComponent,
  FeedbackComponent,
  PitchOMaticComponent,
  GenericRoleplayComponent,
  FeedbackTagsComponent
];

export const PastSessionsEntryComponents = [
  BAPReportComponent,
  GenericRoleplayComponent,
  McqsComponent,
  OptionSpreadComponent,
  OptionDistributionBarsComponent,
  McqTableComponent,
  BrainStormComponent,
  FeedbackComponent,
  PitchOMaticComponent,
  FeedbackTagsComponent,
  ...LearnerReportEntryComponents
];

export const PastSessionsProviders = [];
