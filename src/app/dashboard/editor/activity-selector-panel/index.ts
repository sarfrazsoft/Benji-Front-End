export * from './activity-content/activity-content.component';
export * from './activity-selector-panel.component';
export * from './activity-types/activity-types.component';
export * from './activity-help/activity-help.component';

// import { DynamicFormQuestionComponent } from './acti
// vity-content/dynamic-form/dynamic-form-question/dynamic-form-question.component';
// import { DynamicFormComponent } from './activity-content/dynamic-form/dynamic-form.component';
import { EmojiSelectorComponent } from '../services/formly/components/emoji-selector/emoji-selector.type';
import { ActivityContentComponent } from './activity-content/activity-content.component';
import { QuestionControlService } from './activity-content/services/question-control.service';
import { ActivityHelpComponent } from './activity-help/activity-help.component';
import { ActivitySelectorPanelComponent } from './activity-selector-panel.component';
import { ActivityTypesComponent } from './activity-types/activity-types.component';
import { ActivityComponent as ActivitySelectorActivity } from './activity-types/activity/activity.component';

export const ActivitySelectorComponents = [
  ActivitySelectorActivity,
  EmojiSelectorComponent,
  // DynamicFormComponent,
  ActivityTypesComponent,
  ActivitySelectorPanelComponent,
  ActivityContentComponent,
  // DynamicFormQuestionComponent,
  ActivityHelpComponent,
];

export const ActivitySelectorEntryComponents = [EmojiSelectorComponent];

export const ActivitySelectorProviders = [QuestionControlService];
