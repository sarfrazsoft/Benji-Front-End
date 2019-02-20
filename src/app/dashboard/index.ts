export * from './admin-panel/';
export * from './learners';

import {
  AdminPanelComponent,
  AdminService,
  CoursesComponent,
  CoursesResolver,
  SingleStatComponent,
  StatsComponent,
  UserResolver
} from './admin-panel';

export const DashboardComponents = [
  AdminPanelComponent,
  CoursesComponent,
  SingleStatComponent,
  StatsComponent
];

export const DashboardEntryComponents = [];

export const DashboardProviders = [UserResolver, CoursesResolver, AdminService];
