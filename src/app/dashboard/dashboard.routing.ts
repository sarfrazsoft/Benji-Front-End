import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent, LearnersComponent } from './index';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent
  },
  {
    path: 'learners',
    component: LearnersComponent
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
