export * from './services';

import { AccountComponent } from './account.component';
import { AccountService } from './services';
export { AccountComponent };

export const AccountComponents = [AccountComponent];

export const AccountProviders = [AccountService];
