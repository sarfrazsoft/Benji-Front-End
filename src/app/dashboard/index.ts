export * from './admin-panel/';

import { AdminPanelComponent } from './admin-panel';
import { SingleStatComponent, StatsComponent } from './admin-panel/stats';
import { CoursesComponent } from './courses/courses.component';

export const DashboardComponents = [
  AdminPanelComponent,
  CoursesComponent,
  SingleStatComponent,
  StatsComponent
];

export const DashboardEntryComponents = [];

export const DashboardProviders = [];
