import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent, AdminResolver, LearnersComponent } from './index';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver
    },
    children: [
      {
        path: '',
        component: AdminPanelComponent
      },
      {
        path: 'learners',
        component: LearnersComponent
      }
    ]
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
