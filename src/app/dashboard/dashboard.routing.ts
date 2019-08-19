import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from 'src/app/services/auth/is-admin.guard';
import {
  AccountComponent,
  AdminPanelComponent,
  AdminResolver,
  LearnerResolver,
  LearnersComponent,
  PastSessionsComponent,
  ResetPasswordComponent
} from './index';

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
        loadChildren:
          'src/app/dashboard/learners/learners.module#LearnersModule',
        canLoad: [IsAdminGuard]
      },
      {
        path: 'pastsessions',
        loadChildren:
          'src/app/dashboard/past-sessions/past-sessions.module#PastSessionsModule'
      },
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: 'account/password',
        component: ResetPasswordComponent
      }
    ]
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
