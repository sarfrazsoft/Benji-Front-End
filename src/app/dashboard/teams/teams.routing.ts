import { RouterModule, Routes } from '@angular/router';
import { AdminResolver } from '../admin-panel';
import { AddGroupsComponent, GroupDetailsComponent, TeamsComponent } from './index';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver,
    },
    children: [
      {
        path: '',
        component: TeamsComponent,
      },
      {
        path: 'add',
        component: AddGroupsComponent,
      },
      {
        path: ':id',
        component: GroupDetailsComponent,
      },
    ],
  },
];

export const TeamsRoutes = RouterModule.forChild(routes);
