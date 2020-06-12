import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AcceptInviteComponent,
  ActivateAccountComponent,
  EntryComponent,
} from 'src/app/pages';
import { WhiteLabelResolver } from './services';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'src/app/layout/layout.module#LayoutModule',
  },
  {
    path: 'login/:partner',
    component: EntryComponent,
    resolve: {
      labelInfo: WhiteLabelResolver,
    },
  },
  {
    path: 'login',
    component: EntryComponent,
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
