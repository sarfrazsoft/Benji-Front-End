import { RouterModule, Routes } from '@angular/router';
import { AdminResolver } from '../admin-panel';
import { PastSessionsComponent, ReportsComponent } from './index';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver
    },
    children: [
      {
        path: '',
        component: PastSessionsComponent
      },
      {
        path: ':id',
        component: ReportsComponent
      }
    ]
  }
];

export const PastSessionsRoutes = RouterModule.forChild(routes);
