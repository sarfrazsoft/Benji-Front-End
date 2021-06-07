export * from './admin-panel/';
export * from './learners';
export * from './account';
export * from './past-sessions';
export * from './lessons';
export * from './workspace';

import { TextEditorComponent } from 'src/app/shared/components/text-editor/text-editor.component';
import { AccountComponents, AccountProviders } from './account';
import { AdminComponents, AdminProviders } from './admin-panel';
import { EditorService } from './editor';
import { LessonsComponents } from './lessons';
import { WorkshopPagesComponents, WorkshopPagesProviders } from './workshop-pages';
import { WorkspaceComponents, WorkspaceProviders } from './workspace';

export const DashboardComponents = [
  ...AccountComponents,
  ...AdminComponents,
  ...LessonsComponents,
  ...WorkspaceComponents,
  ...WorkspaceProviders,
];

export const DashboardEntryComponents = [TextEditorComponent];

export const DashboardProviders = [
  ...AdminProviders,
  ...AccountProviders,
  ...WorkspaceProviders,
  EditorService,
];
