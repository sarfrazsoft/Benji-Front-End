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
          'src/app/dashboard/learners/learners.module#LearnersModule'
        // canLoad: [IsAdminGuard]
        // figure out guards to reload easily
      },
      {
        path: 'pastsessions',
        loadChildren:
          'src/app/dashboard/past-sessions/past-sessions.module#PastSessionsModule'
      },
      {
        path: 'groups',
        loadChildren: 'src/app/dashboard/groups/groups.module#GroupsModule',
        canLoad: [IsAdminGuard]
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
