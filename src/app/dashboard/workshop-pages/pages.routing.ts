import { RouterModule, Routes } from '@angular/router';
import { IsAdminGuard } from 'src/app/services/auth/is-admin.guard';
import { AdminResolver } from '../admin-panel';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      dashData: AdminResolver,
    },
    children: [
      {
        path: '',
        component: PagesComponent,
      },
    ],
  },
];

export const PagesRoutes = RouterModule.forChild(routes);
