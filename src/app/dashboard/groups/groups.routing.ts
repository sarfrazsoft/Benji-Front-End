import { RouterModule, Routes } from '@angular/router';
import { AdminResolver } from '../admin-panel';
import {
  AddGroupsComponent,
  GroupDetailsComponent,
  GroupsComponent,
  GroupsResolver
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
        component: GroupsComponent,
        resolve: {
          groups: GroupsResolver
        }
      },
      {
        path: 'add',
        component: AddGroupsComponent
      },
      {
        path: ':id',
        component: GroupDetailsComponent
      }
    ]
  }
];

export const GroupsRoutes = RouterModule.forChild(routes);
