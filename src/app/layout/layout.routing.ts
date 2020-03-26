import { RouterModule, Routes } from '@angular/router';

import {
  MainScreenLessonComponent,
  ParticipantLessonComponent,
  SingleUserComponent
} from 'src/app/pages';
import { LandingComponent } from '../pages/landing/main-screen/landing.component';
import { ParticipantJoinComponent } from '../pages/landing/participant/join/participant-join.component';
import { ParticipantLoginComponent } from '../pages/landing/participant/login/participant-login.component';
import { AuthGuard, WhiteLabelResolver } from '../services';
import { LayoutComponent } from './layout.component';

// TODO; make separate modules for main screen and particicpants
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'landing',
    component: LandingComponent,
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  },
  {
    path: 'landing/:partner',
    component: LandingComponent,
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  },
  {
    path: 'screen/lesson/:roomCode',
    component: MainScreenLessonComponent,
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  },
  {
    path: 'user/lesson/:roomCode',
    component: SingleUserComponent,
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  },
  {
    path: 'participant/login',
    component: ParticipantLoginComponent,
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  },
  {
    path: 'participant/join',
    component: ParticipantJoinComponent,
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  },
  {
    path: 'participant/lesson/:roomCode',
    component: ParticipantLessonComponent,
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    resolve: {
      labelInfo: WhiteLabelResolver
    }
  }
];

export const LayoutRoutes = RouterModule.forChild(routes);
