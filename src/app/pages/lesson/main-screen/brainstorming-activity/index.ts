import { PageComponent as BrainstormPageComponent } from './board/benji-page/page.component';
import { BoardPromptComponent as BrainstormBoardPromptComponent } from './board/board-prompt/board-prompt.component';
import { BoardComponent } from './board/board.component';
import { BrainstormCardComponent } from './brainstorm-card/brainstorm-card.component';
import { BrainstormLayout } from './brainstorm-layout';
import { MainScreenBrainstormingActivityComponent } from './brainstorming-activity.component';
import { CategorizedComponent as BrainstormCategorizedComponent } from './categorized/categorized.component';
import { GridComponent as BrainstormGridComponentComponent } from './grid/grid.component';
import { ThreadModeComponent as BrainstormThreadModeComponent } from './thread-mode/thread-mode.component';

export { BrainstormCardComponent, BoardComponent };
export { BrainstormCategorizedComponent };
export { BrainstormGridComponentComponent };
export { BrainstormThreadModeComponent };
export { MainScreenBrainstormingActivityComponent };
export { BrainstormBoardPromptComponent };
export { BrainstormLayout };
export { BrainstormPageComponent };

export const MainScreenBrainStormComponents = [
  BoardComponent,
  BrainstormCardComponent,
  BrainstormBoardPromptComponent,
  MainScreenBrainstormingActivityComponent,
  BrainstormCategorizedComponent,
  BrainstormThreadModeComponent,
  BrainstormGridComponentComponent,
  BrainstormPageComponent,
];
