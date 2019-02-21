import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent, AdminResolver, LearnersComponent } from './index';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    resolve: {
      dashData: AdminResolver
    }
  },
  {
    path: 'learners',
    component: LearnersComponent
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
