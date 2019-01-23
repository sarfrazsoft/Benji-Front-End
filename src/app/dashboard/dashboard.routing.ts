import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
