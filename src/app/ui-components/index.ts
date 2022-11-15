import { BTwemojiComponent } from '../ui-components/b-twemoji/b-twemoji.component';
import { DynamicTimerComponent } from '../ui-components/dynamic-timer/dynamic-timer.component';
import { NumberTimerComponent } from '../ui-components/number-timer/number-timer.component';
import { RadialTimerComponent } from '../ui-components/radial-timer/radial-timer.component';
import { BoardMenuComponents } from './board-menu';
import { AddControlsComponent } from './board-menu/boards-navigator/add-controls/add-controls.component';
import { BoardsNavigatorComponent } from './board-menu/boards-navigator/boards-navigator.component';
import { ControlComponents } from './controls';
import { NotificationsComponent } from './controls/notifications/notifications.component';
import { ToolbarComponents } from './main-screen-toolbar';
import { SnackBarComponent } from './snack-bar-component/snack-bar.component';

export const UIComponents = [
  DynamicTimerComponent,
  BTwemojiComponent,
  NumberTimerComponent,
  RadialTimerComponent,
  NotificationsComponent,
  SnackBarComponent,
  ...ControlComponents,
  ...ToolbarComponents,
  ...BoardMenuComponents,
  BoardsNavigatorComponent,
  AddControlsComponent,
];
