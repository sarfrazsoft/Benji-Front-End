import { DashboardModule } from '../dashboard/dashboard.module';
// import { AuthGuard } from '@/shared/services/auth.guard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { canActivate: [AuthGuard], path: '', loadChildren: () => DashboardModule },
  {
    path: '',
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule'
  }
];

export const LayoutRoutes = RouterModule.forChild(routes);
