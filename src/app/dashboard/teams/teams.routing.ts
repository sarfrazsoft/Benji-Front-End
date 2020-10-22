import { RouterModule, Routes } from '@angular/router';
import { AdminResolver } from '../admin-panel';
import { AddGroupsComponent, GroupDetailsComponent, GroupsResolver, TeamsComponent } from './index';

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
        resolve: {
          groups: GroupsResolver,
        },
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
