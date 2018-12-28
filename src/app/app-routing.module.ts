import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/main-screen/landing.component';


import { ParticipantLoginComponent } from './pages/landing/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/landing/participant/join/participant-join.component';
import { ElementsComponent } from './elements/elements.component';
import { MainscreenElementsComponent } from './mainscreen-elements/mainscreen-elements.component';
// tslint:disable-next-line:max-line-length
import { MainScreenTeletriviaActivityComponent } from './pages/lesson/main-screen/main-screen-teletrivia-activity/main-screen-teletrivia-activity.component';
import { MainScreenLessonComponent } from './pages/lesson/main-screen/main-screen-lesson.component';
import { MainScreenLobbyComponent } from './pages/lesson/main-screen/main-screen-lobby-activity/main-screen-lobby.component';
import { ParticipantLessonComponent } from './pages/lesson/participant/participant-lesson.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full'},
  { path: 'landing', component: LandingComponent },

  // { path: 'desktop/session/:id', component: SessionComponent },
  { path: 'screen/lesson/:roomCode', component: MainScreenLessonComponent, children: [
    {path: 'lobby', component: MainScreenLobbyComponent }
  ] },

  { path: 'participant/login', component: ParticipantLoginComponent },
  { path: 'participant/join', component: ParticipantJoinComponent },
  { path: 'participant/lesson/:roomCode', component: ParticipantLessonComponent},

  { path: 'elements', component: ElementsComponent},
  { path: 'main-elements', component: MainscreenElementsComponent },
  { path: 'teletrivia', component: MainScreenTeletriviaActivityComponent }

];



@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})


export class AppRoutingModule { }
