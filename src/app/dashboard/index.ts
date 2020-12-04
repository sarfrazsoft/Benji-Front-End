export * from './admin-panel/';
export * from './learners';
export * from './account';
export * from './past-sessions';
export * from './lessons';
export * from './workspace';

import { AccountComponents, AccountProviders } from './account';
import { AdminComponents, AdminProviders } from './admin-panel';
import { EditorService } from './editor';
import { LessonsComponents } from './lessons';
import { WorkspaceComponents, WorkspaceProviders } from './workspace';

export const DashboardComponents = [
  ...AccountComponents,
  ...AdminComponents,
  ...LessonsComponents,
  ...WorkspaceComponents,
];

export const DashboardEntryComponents = [];

export const DashboardProviders = [
  ...AdminProviders,
  ...AccountProviders,
  ...WorkspaceProviders,
  EditorService,
];
