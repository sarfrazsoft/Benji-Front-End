import { AnimatedCheckmarkButtonComponent } from '../ui-components/animated-checkmark-button/animated-checkmark-button.component';
import { BTwemojiComponent } from '../ui-components/b-twemoji/b-twemoji.component';
import { DynamicTimerComponent } from '../ui-components/dynamic-timer/dynamic-timer.component';
import { AttentionOverlayComponent } from '../ui-components/linear-timer/attention-overlay/attention-overlay.component';
import { LinearTimerComponent } from '../ui-components/linear-timer/linear-timer.component';
import { MainScreenFooterComponent } from '../ui-components/main-screen-footer/main-screen-footer.component';
import { NumberTimerComponent } from '../ui-components/number-timer/number-timer.component';
import { ParticipantTimerComponent } from '../ui-components/participant-timer/participant-timer.component';
import { ParticipantToolbarComponent } from '../ui-components/participant-toolbar/participant-toolbar.component';
import { RadialTimerComponent } from '../ui-components/radial-timer/radial-timer.component';
import { BoardMenuComponents } from './board-menu';
import { AddControlsComponent } from './board-menu/boards-navigator/add-controls/add-controls.component';
import { BoardsNavigatorComponent } from './board-menu/boards-navigator/boards-navigator.component';
import { ControlComponents } from './controls';
import { NotificationsComponent } from './controls/notifications/notifications.component';
import { ToolbarComponents } from './main-screen-toolbar';
import { SnackBarComponent } from './snack-bar-component/snack-bar.component';
import { SubmittedCounterComponent } from './submitted-counter/submitted-counter.component';

export const UIComponents = [
  DynamicTimerComponent,
  ParticipantToolbarComponent,
  AnimatedCheckmarkButtonComponent,
  BTwemojiComponent,
  AttentionOverlayComponent,
  LinearTimerComponent,
  MainScreenFooterComponent,
  NumberTimerComponent,
  ParticipantTimerComponent,
  RadialTimerComponent,
  NotificationsComponent,
  SnackBarComponent,
  ...ControlComponents,
  ...ToolbarComponents,
  SubmittedCounterComponent,
  ...BoardMenuComponents,
  BoardsNavigatorComponent,
  AddControlsComponent,
];
