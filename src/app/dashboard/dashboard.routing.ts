import { NONE_TYPE } from '@angular/compiler';
import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from 'src/app/services/auth/is-admin.guard';
import { NotificationsComponent } from '../ui-components/notifications/notifications.component';
import {
  AccountComponent,
  AdminPanelComponent,
  AdminResolver,
  LearnersComponent,
  LessonComponent,
  PastSessionsComponent,
  ResetPasswordComponent,
  TemplatesComponent,
} from './index';
import { WorkspaceComponent } from './workspace/workspace.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: AdminPanelComponent,
      },
      {
        path: 'workspace',
        component: WorkspaceComponent,
      },
      {
        path: 'lesson/:lessonId',
        component: LessonComponent,
      },
      {
        path: 'templates',
        component: TemplatesComponent,
      },
      {
        path: 'participants',
        loadChildren: () =>
          import('src/app/dashboard/learners/learners.module').then((m) => m.LearnersModule),
      },
      {
        path: 'pastsessions',
        loadChildren: () =>
          import('src/app/dashboard/past-sessions/past-sessions.module').then((m) => m.PastSessionsModule),
      },
      {
        path: 'teams',
        loadChildren: () => import('src/app/dashboard/teams/teams.module').then((m) => m.TeamsModule),
      },
      // {
      //   path: 'editor',
      //   loadChildren: () => import('src/app/dashboard/editor/editor.module').then((m) => m.EditorModule),
      // },
      {
        path: 'pages',
        loadChildren: () =>
          import('src/app/dashboard/workshop-pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'account/password',
        component: ResetPasswordComponent,
      },
    ],
  },
];

const routesWithoutResolve: Routes = [
  {
    path: '',
    children: [
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      },
    ],
  },
];


export const DashboardRoutes = RouterModule.forChild(routes);

export const DashboardRoutesWithoutResolve = RouterModule.forChild(routesWithoutResolve);
