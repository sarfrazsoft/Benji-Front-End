export * from './services';

import { AccountComponent } from './account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountService } from './services';
export { AccountComponent, ResetPasswordComponent };

export const AccountComponents = [AccountComponent, ResetPasswordComponent];

export const AccountProviders = [AccountService];
