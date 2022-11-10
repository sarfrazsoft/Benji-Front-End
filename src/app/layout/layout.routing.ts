import { RouterModule, Routes } from '@angular/router';

import {
  CopyTemplateComponent,
  MainScreenLessonComponent,
  ParticipantLessonComponent,
  SessionEndComponent,
} from 'src/app/pages';
import { ParticipantJoinComponent } from '../pages/participant/join/participant-join.component';
import { ParticipantLoginComponent } from '../pages/participant/login/participant-login.component';
import { AuthGuard, DeactivateGuard, WhiteLabelResolver } from '../services';
import { LayoutComponent } from './layout.component';

// TODO; make separate modules for main screen and particicpants
const routes: Routes = [
  {
    path: 'screen/lesson/:roomCode',
    component: MainScreenLessonComponent,
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
    canDeactivate: [DeactivateGuard],
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
  {
    path: 'import/:templateId',
    component: CopyTemplateComponent,
  },
];

export const LayoutRoutes = RouterModule.forChild(routes);
