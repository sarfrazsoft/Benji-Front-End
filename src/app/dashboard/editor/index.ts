export * from './overview-panel/overview-panel.component';
export * from './editor.component';
export * from './preview-panel/preview-panel.component';
export * from './activity-selector-panel/activity-selector-panel.component';

import { ActivitySelectorComponents, ActivitySelectorProviders } from './activity-selector-panel';
import { EditorComponent } from './editor.component';
import { OverviewPanelComponent } from './overview-panel/overview-panel.component';
import { PreviewPanelComponent } from './preview-panel/preview-panel.component';
import { EditorService } from './services/editor.service';

export const EditorComponents = [
  ...ActivitySelectorComponents,
  EditorComponent,
  OverviewPanelComponent,
  PreviewPanelComponent,
];

export const EditorEntryComponents = [];

export const EditorProviders = [EditorService, ...ActivitySelectorProviders];
