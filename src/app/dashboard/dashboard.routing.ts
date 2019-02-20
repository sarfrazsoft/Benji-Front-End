import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent, LearnersComponent, UserResolver } from './index';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    resolve: { userData: UserResolver }
  },
  {
    path: 'learners',
    component: LearnersComponent
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
