import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from 'src/app/services/auth/is-admin.guard';
import {
  AccountComponent,
  AdminPanelComponent,
  AdminResolver,
  CourseComponent,
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
        path: 'course/:courseId',
        component: CourseComponent
      },
      {
        path: 'learners',
        loadChildren:
          'src/app/dashboard/learners/learners.module#LearnersModule'
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
