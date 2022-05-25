import { BoardPromptComponent as BrainstormBoardPromptComponent } from './board/board-prompt/board-prompt.component';
import { BoardComponent } from './board/board.component';
import { BrainstormCardComponent } from './brainstorm-card/brainstorm-card.component';
import { MainScreenBrainstormingActivityComponent } from './brainstorming-activity.component';
import { CategorizedComponent as BrainstormCategorizedComponent } from './categorized/categorized.component';
import { ThreadModeComponent as BrainstormThreadModeComponent } from './thread-mode/thread-mode.component';
import { UncategorizedComponent as BrainstormUncategorizedComponent } from './uncategorized/uncategorized.component';

export { BrainstormCardComponent, BoardComponent };
export { BrainstormCategorizedComponent };
export { BrainstormUncategorizedComponent };
export { BrainstormThreadModeComponent };
export { MainScreenBrainstormingActivityComponent };

export const MainScreenBrainStormComponents = [
  BoardComponent,
  BrainstormCardComponent,
  BrainstormBoardPromptComponent,
  MainScreenBrainstormingActivityComponent,
  BrainstormCategorizedComponent,
  BrainstormUncategorizedComponent,
  BrainstormThreadModeComponent,
];
