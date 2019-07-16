export * from './admin-panel/';
export * from './learners';
export * from './account';
export * from './past-sessions';

import { AccountComponents, AccountProviders } from './account';
import {
  AdminComponents,
  AdminPanelComponent,
  AdminProviders,
  AdminResolver,
  AdminService
} from './admin-panel';
import { PastSessionsComponents, PastSessionsProviders } from './past-sessions';

export const DashboardComponents = [
  ...AccountComponents,
  ...AdminComponents,
  ...PastSessionsComponents
];

export const DashboardEntryComponents = [];

export const DashboardProviders = [
  ...AdminProviders,
  ...AccountProviders,
  ...PastSessionsProviders
];
