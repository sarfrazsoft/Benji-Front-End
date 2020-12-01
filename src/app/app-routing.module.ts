import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AcceptInviteComponent,
  ActivateAccountComponent,
  LoginComponent,
  SignupComponent,
} from 'src/app/pages';
import { WhiteLabelResolver } from './services';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'login/:partner',
    component: LoginComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'signup',
    component: SignupComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'activate/:confirmationCode',
    component: ActivateAccountComponent,
  },
  {
    path: 'accept_invite/:inviteId/:inviteToken',
    component: AcceptInviteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
