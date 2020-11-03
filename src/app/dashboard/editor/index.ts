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
import { OverviewThumbnailComponent } from './overview-panel/overview-thumbnail/overview-thumbnail.component';
import { PreviewPanelComponent } from './preview-panel/preview-panel.component';
import {
  ArrayTypeComponent,
  FeedbackQuestionTypeComponent,
  FormlySelectOptionsPipe,
  MCQChoiceTypeComponent,
  MultiSchemaTypeComponent,
  NullTypeComponent,
  ObjectTypeComponent,
  QuestionTypeSelectComponent,
  SafePipe,
} from './services';
import { EditorResolver } from './services/editor.resolver';
import { EditorService } from './services/editor.service';
import { CheckboxWrapperComponent } from './services/formly/warppers/checkbox-wrapper/checkbox-wrapper.component';
import { FieldRevealWrapperComponent } from './services/formly/warppers/field-reveal-wrapper/field-reveal-wrapper.component';
import { FieldWrapperComponent } from './services/formly/warppers/field-wrapper/field-wrapper.component';

export const EditorComponents = [
  ...ActivitySelectorComponents,
  SafePipe,
  OverviewThumbnailComponent,
  EditorComponent,
  OverviewPanelComponent,
  PreviewPanelComponent,
  ArrayTypeComponent,
  ObjectTypeComponent,
  MultiSchemaTypeComponent,
  NullTypeComponent,
  FieldRevealWrapperComponent,
  FieldWrapperComponent,
  CheckboxWrapperComponent,
  MCQChoiceTypeComponent,
  FeedbackQuestionTypeComponent,
  QuestionTypeSelectComponent,
  FormlySelectOptionsPipe,
];

export const EditorEntryComponents = [...ActivitySelectorEntryComponents];

export const EditorProviders = [EditorService, EditorResolver, ...ActivitySelectorProviders];
