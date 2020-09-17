export * from './overview-panel/overview-panel.component';
export * from './editor.component';
export * from './preview-panel/preview-panel.component';
export * from './activity-selector-panel/activity-selector-panel.component';

import {
  ActivitySelectorComponents,
  ActivitySelectorEntryComponents,
  ActivitySelectorProviders,
} from './activity-selector-panel';
import { EditorComponent } from './editor.component';
import { OverviewPanelComponent } from './overview-panel/overview-panel.component';
import { PreviewPanelComponent } from './preview-panel/preview-panel.component';
import {
  ArrayTypeComponent,
  MultiSchemaTypeComponent,
  NullTypeComponent,
  ObjectTypeComponent,
} from './services';
import { EditorService } from './services/editor.service';

export const EditorComponents = [
  ...ActivitySelectorComponents,
  EditorComponent,
  OverviewPanelComponent,
  PreviewPanelComponent,
  ArrayTypeComponent,
  ObjectTypeComponent,
  MultiSchemaTypeComponent,
  NullTypeComponent,
];

export const EditorEntryComponents = [...ActivitySelectorEntryComponents];

export const EditorProviders = [EditorService, ...ActivitySelectorProviders];
