import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';

import { SessionComponent } from './pages/main-screen/session/session.component';

import { ParticipantLoginComponent } from './pages/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/participant/join/participant-join.component';
import { ParticipantSessionComponent } from './pages/participant/session/participant-session.component';
import { ElementsComponent } from './elements/elements.component'; //gitignore
import { MainscreenElementsComponent } from './mainscreen-elements/mainscreen-elements.component'; //gitignore
// tslint:disable-next-line:max-line-length
import { MainScreenTeletriviaActivityComponent } from './pages/main-screen/session/activities/teletrivia/main-screen-teletrivia-activity.component';
import { MainScreenLessonComponent } from './main-screen-lesson/main-screen-lesson.component';
import { MainScreenLobbyComponent } from './pages/main-screen/session/lobby/main-screen-lobby.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full'},
  { path: 'landing', component: LandingComponent },

  // { path: 'desktop/session/:id', component: SessionComponent },
  { path: 'screen/lesson/:lessonId', component: MainScreenLessonComponent, children: [
    {path: 'lobby', component: MainScreenLobbyComponent }
  ] },
  { path: 'participant/login', component: ParticipantLoginComponent },
  { path: 'participant/join', component: ParticipantJoinComponent },
  { path: 'participant/session', component: ParticipantSessionComponent },
  { path: 'elements', component: ElementsComponent},//gitignore
  { path: 'main-elements', component: MainscreenElementsComponent },//gitignore
  { path: 'teletrivia', component: MainScreenTeletriviaActivityComponent }

];



@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})


export class AppRoutingModule { }
