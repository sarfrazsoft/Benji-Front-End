import { BoardMenuComponent } from './board-menu.component';
import { BoardBackgroundComponent } from './board-settings/board-background/board-background.component';
import { BoardModeComponent } from './board-settings/board-mode/board-mode.component';
import { BoardSettingsComponent } from './board-settings/board-settings.component';
import { BoardStatusComponent } from './board-settings/board-status/board-status.component';
import { PostSizeComponent } from './board-settings/post-size/post-size.component';
import { TopicMediaComponent } from './board-settings/topic-media/topic-media.component';

export const BoardMenuComponents = [
  BoardStatusComponent,
  BoardMenuComponent,
  TopicMediaComponent,
  BoardSettingsComponent,
  BoardModeComponent,
  PostSizeComponent,
  BoardBackgroundComponent,
];
