export * from './learners.component';
export * from './table/table.component';
export * from './learner/learner-report/learner-report.component';
export * from './services';

import { AddLearnersDialogComponent } from './add-learners-dialog/add-learners.dialog';
import { LearnerComponents, LearnerEntryComponents } from './learner';
import { LearnerReportComponent } from './learner/learner-report/learner-report.component';
import { LearnersComponent } from './learners.component';
import { LearnerResolver, LearnerService } from './services';
import { LearnersTableComponent } from './table/table.component';

export const LearnersComponents = [
  ...LearnerComponents,
  LearnersComponent,
  LearnersTableComponent,
  LearnerReportComponent,
  AddLearnersDialogComponent,
];

export const LearnersEntryComponents = [...LearnerEntryComponents, AddLearnersDialogComponent];

export const LearnersProviders = [LearnerService, LearnerResolver];
