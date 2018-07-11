import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';

import { SessionComponent } from './pages/desktop/session/session.component';

import { MobileLoginComponent } from './pages/mobile/login/mobile-login.component';
import { MobileJoinComponent } from './pages/mobile/join/mobile-join.component';
import { MobileSessionComponent } from './pages/mobile/session/mobile-session.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full'},
  { path: 'landing', component: LandingComponent },

  { path: 'desktop/session', component: SessionComponent },

  { path: 'mobile/login', component: MobileLoginComponent },
  { path: 'mobile/join', component: MobileJoinComponent },
  { path: 'mobile/session', component: MobileSessionComponent },
];



@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})


export class AppRoutingModule { }
