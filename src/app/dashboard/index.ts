export * from './admin-panel/';
export * from './learners';
export * from './account';

import { AccountComponents, AccountProviders } from './account';
import {
  AdminComponents,
  AdminPanelComponent,
  AdminProviders,
  AdminResolver,
  AdminService
} from './admin-panel';

export const DashboardComponents = [...AccountComponents, ...AdminComponents];

export const DashboardEntryComponents = [];

export const DashboardProviders = [...AdminProviders, ...AccountProviders];
