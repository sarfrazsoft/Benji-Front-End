import { PageComponent as BrainstormPageComponent } from './board/benji-page/page.component';
import { BoardPromptComponent as BrainstormBoardPromptComponent } from './board/board-prompt/board-prompt.component';
import { BoardComponent } from './board/board.component';
import { BrainstormCardComponent } from './brainstorm-card/brainstorm-card.component';
import { CardFeedbackComponent } from './brainstorm-card/card-feedback/card-feedback.component';
import { CommentReplyComponent } from './brainstorm-card/card-feedback/comment-reply/comment-reply.component';
import { PostedCommentComponent } from './brainstorm-card/card-feedback/posted-comment/posted-comment.component';
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
export { CardFeedbackComponent };
export { CommentReplyComponent };
export { PostedCommentComponent };

export const MainScreenBrainStormComponents = [
  BoardComponent,
  BrainstormCardComponent,
  BrainstormBoardPromptComponent,
  MainScreenBrainstormingActivityComponent,
  BrainstormCategorizedComponent,
  BrainstormThreadModeComponent,
  BrainstormGridComponentComponent,
  BrainstormPageComponent,
  CardFeedbackComponent,
  CommentReplyComponent,
  PostedCommentComponent,
];
