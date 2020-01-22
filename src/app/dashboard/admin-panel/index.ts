import { CoursesComponent } from '../courses/courses-list/courses.component';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminResolver } from './services/admin.resolver';
import { AdminService } from './services/admin.service';
import { SingleStatComponent } from './stats/single-stat/single-stat.component';
import { StatsComponent } from './stats/stats.component';

export * from './admin-panel.component';
export * from '../courses/courses-list/courses.component';
export * from './stats';
export * from './services';

export const AdminComponents = [
  AdminPanelComponent,
  CoursesComponent,
  SingleStatComponent,
  StatsComponent
];

export const AdminProviders = [AdminResolver, AdminService];
