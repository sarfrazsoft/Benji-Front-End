import { AcceptInviteComponent } from './accept-invite/accept-invite.component';
import { ActivateAccountComponent } from './activate-account/activate-account.component';
import { BTwemoji2Component } from './activate-account/b-twemoji2/b-twemoji.component';
import { LoginComponent } from './desktop/login/login.component';
import { SignupComponent } from './desktop/signup/signup.component';
import { EntryComponent } from './entry.component';

import { DesktopComponent as DesktopEntryComponents } from './desktop/desktop.component';

import { LoginComponent as MobLoginComponent } from './mobile/login/login.component';
import { MobileComponent } from './mobile/mobile.component';
import { SignupComponent as MobSignupComponent } from './mobile/signup/signup.component';

export {
  AcceptInviteComponent,
  ActivateAccountComponent,
  BTwemoji2Component,
  EntryComponent,
  LoginComponent,
  SignupComponent,
  MobLoginComponent,
  MobSignupComponent,
  MobileComponent,
};

export const EntryComponents = [
  AcceptInviteComponent,
  ActivateAccountComponent,
  BTwemoji2Component,
  DesktopEntryComponents,
  EntryComponent,
  LoginComponent,
  MobLoginComponent,
  MobSignupComponent,
  SignupComponent,
  MobileComponent,
];
