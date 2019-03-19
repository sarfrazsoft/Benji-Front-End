import { RouterModule, Routes } from '@angular/router';
import {
  AdminPanelComponent,
  AdminResolver,
  LearnerResolver,
  LearnersComponent
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
        component: LearnersComponent,
        resolve: {
          learner: LearnerResolver
        }
      }
    ]
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
