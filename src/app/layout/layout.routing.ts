import { RouterModule, Routes } from '@angular/router';

import { EntryComponent } from '../pages/entry/entry.component';
import { LandingComponent } from '../pages/landing/main-screen/landing.component';
import { ParticipantJoinComponent } from '../pages/landing/participant/join/participant-join.component';
import { ParticipantLoginComponent } from '../pages/landing/participant/login/participant-login.component';
import { MainScreenLessonComponent } from '../pages/lesson/main-screen/main-screen-lesson.component';
import { ParticipantLessonComponent } from '../pages/lesson/participant/participant-lesson.component';
import { AuthGuard } from '../services';

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
    path: 'admin',
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    component: EntryComponent
  }
];

export const LayoutRoutes = RouterModule.forChild(routes);
