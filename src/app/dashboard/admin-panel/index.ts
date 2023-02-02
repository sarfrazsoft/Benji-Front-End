import { AdminPanelComponent } from './admin-panel.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { AdminResolver } from './services/admin.resolver';
import { AdminService } from './services/admin.service';

export * from './admin-panel.component';
export * from './services';

export const AdminComponents = [AdminPanelComponent, DashboardHeaderComponent];

export const AdminProviders = [AdminResolver, AdminService];
