export { MainScreenSharingToolComponent } from './sharing-tool/sharing-tool.component';
export { MainScreenGroupingToolComponent } from './grouping-tool/grouping-tool.component';

import { MainScreenGroupingToolComponent } from './grouping-tool/grouping-tool.component';
import { SharingActivitiesComponents } from './sharing-tool';
import { MainScreenSharingToolComponent } from './sharing-tool/sharing-tool.component';

export const SharedMainScreenComponents = [
  SharingActivitiesComponents,
  MainScreenSharingToolComponent,
  MainScreenGroupingToolComponent,
];
