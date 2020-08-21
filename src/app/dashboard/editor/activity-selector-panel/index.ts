export * from './activity-content/activity-content.component';
export * from './activity-selector-panel.component';
export * from './activity-types/activity-types.component';

import { ActivityContentComponent } from './activity-content/activity-content.component';
import { DynamicFormQuestionComponent } from './activity-content/dynamic-form/dynamic-form-question/dynamic-form-question.component';
import { DynamicFormComponent } from './activity-content/dynamic-form/dynamic-form.component';
import { QuestionControlService } from './activity-content/services/question-control.service';
import { ActivitySelectorPanelComponent } from './activity-selector-panel.component';
import { ActivityTypesComponent } from './activity-types/activity-types.component';

export const ActivitySelectorComponents = [
  DynamicFormComponent,
  ActivityTypesComponent,
  ActivitySelectorPanelComponent,
  ActivityContentComponent,
  DynamicFormQuestionComponent,
];

export const ActivitySelectorProviders = [QuestionControlService];
