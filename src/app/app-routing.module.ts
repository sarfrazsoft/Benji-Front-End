import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';

import { SessionComponent } from './pages/main-screen/session/session.component';

import { ParticipantLoginComponent } from './pages/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/participant/join/participant-join.component';
import { ParticipantSessionComponent } from './pages/participant/session/participant-session.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full'},
  { path: 'landing', component: LandingComponent },

  { path: 'desktop/session', component: SessionComponent },

  { path: 'participant/login', component: ParticipantLoginComponent },
  { path: 'participant/join', component: ParticipantJoinComponent },
  { path: 'participant/session', component: ParticipantSessionComponent },
];



@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})


export class AppRoutingModule { }
