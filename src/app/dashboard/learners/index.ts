export * from './learners.component';
export * from './add-learners/add-learners.component';
export * from './learners-table/learners-table.component';
export * from './learner-report/learner-report.component';
export * from './services';

import { AddLearnersComponent } from './add-learners/add-learners.component';
import { LearnerReportComponent } from './learner-report/learner-report.component';
import { McqComponent as McqLearnerComponent } from './learner-report/mcq/mcq.component';
import { PitchOMaticComponent as LearnerPitchOMaticComponent } from './learner-report/pitch-o-matic/pitch-o-matic.component';
import { LearnersTableComponent } from './learners-table/learners-table.component';
import { LearnersComponent } from './learners.component';
import { LearnerResolver, LearnerService } from './services';

export const LearnersComponents = [
  McqLearnerComponent,
  LearnerPitchOMaticComponent,
  AddLearnersComponent,
  LearnersComponent,
  LearnersTableComponent,
  LearnerReportComponent
];

export const LearnersEntryComponents = [];

export const LearnersProviders = [LearnerService, LearnerResolver];
