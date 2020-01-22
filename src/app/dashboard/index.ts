export * from './admin-panel/';
export * from './learners';
export * from './account';
export * from './past-sessions';
export * from './courses';

import { AccountComponents, AccountProviders } from './account';
import { AdminComponents, AdminProviders } from './admin-panel';
import { CoursesComponents } from './courses';

export const DashboardComponents = [
  ...AccountComponents,
  ...AdminComponents,
  ...CoursesComponents
];

export const DashboardEntryComponents = [];

export const DashboardProviders = [...AdminProviders, ...AccountProviders];
