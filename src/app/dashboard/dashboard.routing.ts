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
        loadChildren:
          'src/app/dashboard/learners/learners.module#LearnersModule'
      }
    ]
  }
];

export const DashboardRoutes = RouterModule.forChild(routes);
