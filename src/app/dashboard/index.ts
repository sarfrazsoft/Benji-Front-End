export * from './admin-panel/';
export * from './learners';

import {
  AdminPanelComponent,
  AdminResolver,
  AdminService,
  CoursesComponent,
  SingleStatComponent,
  StatsComponent
} from './admin-panel';

export const DashboardComponents = [
  AdminPanelComponent,
  CoursesComponent,
  SingleStatComponent,
  StatsComponent
];

export const DashboardEntryComponents = [];

export const DashboardProviders = [AdminResolver, AdminService];
