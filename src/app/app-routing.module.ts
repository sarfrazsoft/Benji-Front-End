import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ElementsComponent } from './elements/elements.component';
import { MainscreenElementsComponent } from './mainscreen-elements/mainscreen-elements.component';
import { LandingComponent } from './pages/landing/main-screen/landing.component';
import { ParticipantJoinComponent } from './pages/landing/participant/join/participant-join.component';
import { ParticipantLoginComponent } from './pages/landing/participant/login/participant-login.component';
import { MainScreenLessonComponent } from './pages/lesson/main-screen/main-screen-lesson.component';
import { MainScreenLobbyComponent } from './pages/lesson/main-screen/main-screen-lobby-activity/main-screen-lobby.component';
import { MainScreenTeletriviaActivityComponent } from './pages/lesson/main-screen/main-screen-teletrivia-activity/main-screen-teletrivia-activity.component';
import { ParticipantLessonComponent } from './pages/lesson/participant/participant-lesson.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'src/app/layout/layout.module#LayoutModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
