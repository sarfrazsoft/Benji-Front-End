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
  ResetPasswordComponent,
} from './index';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver,
    },
    children: [
      {
        path: '',
        component: AdminPanelComponent,
      },
      {
        path: 'course/:courseId',
        component: CourseComponent,
      },
      {
        path: 'learners',
        loadChildren: () =>
          import('src/app/dashboard/learners/learners.module').then(
            (m) => m.LearnersModule
          ),
      },
      {
        path: 'pastsessions',
        loadChildren: () =>
          import('src/app/dashboard/past-sessions/past-sessions.module').then(
            (m) => m.PastSessionsModule
          ),
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('src/app/dashboard/groups/groups.module').then(
            (m) => m.GroupsModule
          ),
      },
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'editor',
        loadChildren: () =>
          import('src/app/dashboard/editor/editor.module').then(
            (m) => m.EditorModule
          ),
      },
      {
        path: 'account/password',
        component: ResetPasswordComponent,
      },
    ],
  },
];

export const DashboardRoutes = RouterModule.forChild(routes);
