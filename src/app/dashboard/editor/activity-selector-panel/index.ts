export * from './activity-content/activity-content.component';
export * from './activity-selector-panel.component';
export * from './activity-types/activity-types.component';

import { ActivityContentComponent } from './activity-content/activity-content.component';
import { ActivitySelectorPanelComponent } from './activity-selector-panel.component';
import { ActivityTypesComponent } from './activity-types/activity-types.component';

export const ActivitySelectorComponents = [
  ActivityTypesComponent,
  ActivitySelectorPanelComponent,
  ActivityContentComponent,
];
