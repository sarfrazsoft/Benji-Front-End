import { BoardPromptComponent as BrainstormBoardPromptComponent } from './board/board-prompt/board-prompt.component';
import { BoardComponent } from './board/board.component';
import { BrainstormCardComponent } from './brainstorm-card/brainstorm-card.component';
import { MainScreenBrainstormingActivityComponent } from './brainstorming-activity.component';
import { CategorizedComponent as BrainstormCategorizedComponent } from './categorized/categorized.component';
import { GridComponent as BrainstormGridComponentComponent } from './grid/grid.component';
import { ThreadModeComponent as BrainstormThreadModeComponent } from './thread-mode/thread-mode.component';
import { UncategorizedComponent as BrainstormUncategorizedComponent } from './uncategorized/uncategorized.component';
import { UnsortedComponent as BrainstormUnsortedComponentComponent } from './unsorted/unsorted.component';

export { BrainstormCardComponent, BoardComponent };
export { BrainstormCategorizedComponent };
export { BrainstormUncategorizedComponent };
export { BrainstormUnsortedComponentComponent };
export { BrainstormGridComponentComponent };
export { BrainstormThreadModeComponent };
export { MainScreenBrainstormingActivityComponent };
export { BrainstormBoardPromptComponent };

export const MainScreenBrainStormComponents = [
  BoardComponent,
  BrainstormCardComponent,
  BrainstormBoardPromptComponent,
  MainScreenBrainstormingActivityComponent,
  BrainstormCategorizedComponent,
  BrainstormUncategorizedComponent,
  BrainstormThreadModeComponent,
  BrainstormUnsortedComponentComponent,
  BrainstormGridComponentComponent,
];
