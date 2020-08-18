export * from './admin-panel/';
export * from './learners';
export * from './account';
export * from './past-sessions';
export * from './lessons';

import { AccountComponents, AccountProviders } from './account';
import { AdminComponents, AdminProviders } from './admin-panel';
import { LessonsComponents } from './lessons';

export const DashboardComponents = [...AccountComponents, ...AdminComponents, ...LessonsComponents];

export const DashboardEntryComponents = [];

export const DashboardProviders = [...AdminProviders, ...AccountProviders];
