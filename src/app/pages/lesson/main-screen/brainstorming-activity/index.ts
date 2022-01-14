import { BoardComponent } from './board/board.component';
import { BrainstormCardComponent } from './brainstorm-card/brainstorm-card.component';
import { MainScreenBrainstormingActivityComponent } from './brainstorming-activity.component';
import { CategorizedComponent as BrainstormCategorizedComponent } from './categorized/categorized.component';
import { UncategorizedComponent as BrainstormUncategorizedComponent } from './uncategorized/uncategorized.component';

export { BrainstormCardComponent, BoardComponent };
export { BrainstormCategorizedComponent };
export { BrainstormUncategorizedComponent };
export { MainScreenBrainstormingActivityComponent };

export const MainScreenBrainStormComponents = [
  BoardComponent,
  BrainstormCardComponent,
  MainScreenBrainstormingActivityComponent,
  BrainstormCategorizedComponent,
  BrainstormUncategorizedComponent,
];
