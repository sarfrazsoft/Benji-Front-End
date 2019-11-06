export * from './learner.component';
export * from './learner-report/learner-report.component';

import { LearnerReportComponent } from './learner-report/learner-report.component';
import { McqComponent as McqLearnerComponent } from './learner-report/mcq/mcq.component';
import { PitchOMaticComponent as LearnerPitchOMaticComponent } from './learner-report/pitch-o-matic/pitch-o-matic.component';
import { LearnerComponent } from './learner.component';
import { SessionsComponent } from './sessions/sessions.component';

export const LearnerComponents = [
  McqLearnerComponent,
  LearnerPitchOMaticComponent,
  LearnerComponent,
  LearnerReportComponent,
  SessionsComponent
];

export const LearnersEntryComponents = [];

export const LearnersProviders = [];
