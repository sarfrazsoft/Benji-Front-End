import { CoursesComponent } from '../courses/courses-list/courses.component';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminResolver } from './services/admin.resolver';
import { AdminService } from './services/admin.service';

export * from './admin-panel.component';
export * from '../courses/courses-list/courses.component';
export * from './services';

export const AdminComponents = [AdminPanelComponent, CoursesComponent];

export const AdminProviders = [AdminResolver, AdminService];
