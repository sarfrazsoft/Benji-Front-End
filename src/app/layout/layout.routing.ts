import { RouterModule, Routes } from '@angular/router';

import {
  MainScreenLessonComponent,
  ParticipantLessonComponent,
  SessionEndComponent,
  SingleUserComponent,
} from 'src/app/pages';
import { ParticipantJoinComponent } from '../pages/participant/join/participant-join.component';
import { ParticipantLoginComponent } from '../pages/participant/login/participant-login.component';
import { AuthGuard, WhiteLabelResolver } from '../services';
import { LayoutComponent } from './layout.component';

// TODO; make separate modules for main screen and particicpants
const routes: Routes = [
  { path: '', redirectTo: '/participant/join', pathMatch: 'full' },
  {
    path: 'screen/lesson/:roomCode',
    component: MainScreenLessonComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'user/lesson/:roomCode',
    component: SingleUserComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'participant/login',
    component: ParticipantLoginComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'participant/join',
    component: ParticipantJoinComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'participant/lesson/:roomCode',
    component: ParticipantLessonComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'participant/end',
    component: SessionEndComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () => import('src/app/dashboard/dashboard.module').then((m) => m.DashboardModule),
    // canLoad not used because parameters were not available in it
    // canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
];

export const LayoutRoutes = RouterModule.forChild(routes);
