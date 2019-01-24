import { DashboardModule } from '../dashboard/dashboard.module';
// import { AuthGuard } from '@/shared/services/auth.guard';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from '../pages/landing/main-screen/landing.component';
import { ParticipantLoginComponent } from '../pages/landing/participant/login/participant-login.component';
import { ParticipantJoinComponent } from '../pages/landing/participant/join/participant-join.component';
import { MainScreenLessonComponent } from '../pages/lesson/main-screen/main-screen-lesson.component';
import { ParticipantLessonComponent } from '../pages/lesson/participant/participant-lesson.component';

const routes: Routes = [
  // { canActivate: [AuthGuard], path: '', loadChildren: () => DashboardModule },
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
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule'
  }
];

export const LayoutRoutes = RouterModule.forChild(routes);
