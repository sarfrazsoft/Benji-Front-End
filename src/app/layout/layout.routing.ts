import { RouterModule, Routes } from '@angular/router';

import {
  MainScreenLessonComponent,
  ParticipantLessonComponent
} from 'src/app/pages';
import { LandingComponent } from '../pages/landing/main-screen/landing.component';
import { ParticipantJoinComponent } from '../pages/landing/participant/join/participant-join.component';
import { ParticipantLoginComponent } from '../pages/landing/participant/login/participant-login.component';
import { AuthGuard } from '../services';
import { LayoutComponent } from './layout.component';

// TODO; make separate modules for main screen and particicpants
const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  {
    path: 'screen/lesson/:roomCode',
    component: MainScreenLessonComponent
  },
  { path: 'participant/login', component: ParticipantLoginComponent },
  { path: 'participant/join', component: ParticipantJoinComponent },
  {
    path: 'participant/lesson/:roomCode',
    component: ParticipantLessonComponent
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  }
];

export const LayoutRoutes = RouterModule.forChild(routes);
