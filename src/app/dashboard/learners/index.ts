export * from './learners.component';
export * from './add/add.component';
export * from './table/table.component';
export * from './learner/learner-report/learner-report.component';
export * from './services';

import { AddLearnersComponent } from './add/add.component';
import { LearnerComponents, LearnerEntryComponents } from './learner';
import { LearnerReportComponent } from './learner/learner-report/learner-report.component';
import { LearnersComponent } from './learners.component';
import { LearnerResolver, LearnerService } from './services';
import { LearnersTableComponent } from './table/table.component';

export const LearnersComponents = [
  ...LearnerComponents,
  AddLearnersComponent,
  LearnersComponent,
  LearnersTableComponent,
  LearnerReportComponent
];

export const LearnersEntryComponents = [...LearnerEntryComponents];

export const LearnersProviders = [LearnerService, LearnerResolver];
