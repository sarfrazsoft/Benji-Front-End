import { RouterModule, Routes } from '@angular/router';
import { AdminResolver } from '../admin-panel';
import {
  AddLearnersComponent,
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
        component: LearnersComponent,
        resolve: {
          learner: LearnerResolver
        }
      },
      {
        path: 'add',
        component: AddLearnersComponent
      }
    ]
  }
];

export const LearnersRoutes = RouterModule.forChild(routes);
