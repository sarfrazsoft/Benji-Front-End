export * from './learners.component';
export * from './add-learners/add-learners.component';
export * from './learners-table/learners-table.component';
export * from './services';

import { AddLearnersComponent } from './add-learners/add-learners.component';
import { LearnersTableComponent } from './learners-table/learners-table.component';
import { LearnersComponent } from './learners.component';
import { LearnerResolver, LearnerService } from './services';

export const LearnersComponents = [
  AddLearnersComponent,
  LearnersComponent,
  LearnersTableComponent
];

export const LearnersEntryComponents = [];

export const LearnersProviders = [LearnerService, LearnerResolver];
