import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from 'src/app/services/auth/is-admin.guard';
import { AdminResolver } from '../admin-panel';
import { EditorComponent } from './index';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver,
    },
    children: [
      {
        path: '',
        component: EditorComponent,
        canActivate: [IsAdminGuard],
      },
    ],
  },
];

export const EditorRoutes = RouterModule.forChild(routes);
