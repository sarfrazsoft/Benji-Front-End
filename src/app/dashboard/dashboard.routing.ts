import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from 'src/app/services/auth/is-admin.guard';
import {
  AccountComponent,
  AdminPanelComponent,
  AdminResolver,
  LearnerResolver,
  LearnersComponent,
  LessonComponent,
  PastSessionsComponent,
  ResetPasswordComponent,
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
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'editor',
        loadChildren: () => import('src/app/dashboard/editor/editor.module').then((m) => m.EditorModule),
      },
      {
        path: 'account/password',
        component: ResetPasswordComponent,
      },
    ],
  },
];

export const DashboardRoutes = RouterModule.forChild(routes);
