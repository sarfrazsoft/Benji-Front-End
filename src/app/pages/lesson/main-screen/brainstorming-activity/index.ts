import { BrainstormCardComponent } from './brainstorm-card/brainstorm-card.component';
import { MainScreenBrainstormingActivityComponent } from './brainstorming-activity.component';
import { CategorizedComponent as BrainstormCategorizedComponent } from './categorized/categorized.component';
import { UncategorizedComponent as BrainstormUncategorizedComponent } from './uncategorized/uncategorized.component';

export { BrainstormCardComponent };
export { BrainstormCategorizedComponent };
export { BrainstormUncategorizedComponent };
export { MainScreenBrainstormingActivityComponent };

export const MainScreenBrainStormComponents = [
  BrainstormCardComponent,
  MainScreenBrainstormingActivityComponent,
  BrainstormCategorizedComponent,
  BrainstormUncategorizedComponent,
];
