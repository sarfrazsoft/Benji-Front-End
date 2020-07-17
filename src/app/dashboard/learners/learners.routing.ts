import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from 'src/app/services/auth/is-admin.guard';
import { AdminResolver } from '../admin-panel';
import {
  AddLearnersComponent,
  LearnerReportComponent,
  LearnerResolver,
  LearnersComponent,
} from './index';
import { LearnerComponent } from './learner/learner.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver,
    },
    children: [
      {
        path: '',
        component: LearnersComponent,
        resolve: {
          learner: LearnerResolver,
        },
        canActivate: [IsAdminGuard],
      },
      {
        path: 'add',
        component: AddLearnersComponent,
      },
      {
        path: 'report',
        component: LearnerReportComponent,
      },
      {
        path: ':learnerID',
        component: LearnerComponent,
      },
      {
        path: ':id/:ids',
        component: LearnerReportComponent,
      },
    ],
  },
];

export const LearnersRoutes = RouterModule.forChild(routes);
