export * from './admin-panel/';
export * from './learners';
export * from './account';
export * from './past-sessions';

import { AccountComponents, AccountProviders } from './account';
import { AdminComponents, AdminProviders } from './admin-panel';

export const DashboardComponents = [...AccountComponents, ...AdminComponents];

export const DashboardEntryComponents = [];

export const DashboardProviders = [...AdminProviders, ...AccountProviders];
