export * from './learners.component';
export * from './add-learners/add-learners.component';
export * from './learners-table/learners-table.component';
export * from './learner/learner-report/learner-report.component';
export * from './services';

import { AddLearnersComponent } from './add-learners/add-learners.component';
import { LearnerComponents } from './learner';
import { LearnerReportComponent } from './learner/learner-report/learner-report.component';
import { LearnersTableComponent } from './learners-table/learners-table.component';
import { LearnersComponent } from './learners.component';
import { LearnerResolver, LearnerService } from './services';

export const LearnersComponents = [
  ...LearnerComponents,
  AddLearnersComponent,
  LearnersComponent,
  LearnersTableComponent,
  LearnerReportComponent
];

export const LearnersEntryComponents = [];

export const LearnersProviders = [LearnerService, LearnerResolver];
