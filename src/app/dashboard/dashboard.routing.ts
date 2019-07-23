import { RouterModule, Routes } from '@angular/router';
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
      },
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: 'account/password',
        component: ResetPasswordComponent
      },
      {
        path: 'pastsessions',
        component: PastSessionsComponent
      }
    ]
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
