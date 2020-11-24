export * from './components';
export * from './directives';
export * from './dialogs';

import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';

import {
  BrainStormComponents,
  MainScreenFeedbackActivityComponent,
  MainScreenPopQuizComponent,
  MainScreenTitleActivityComponent,
} from 'src/app/pages/lesson/main-screen';

import { BTwemojiComponent } from '../ui-components/b-twemoji/b-twemoji.component';
import { AttentionOverlayComponent } from '../ui-components/linear-timer/attention-overlay/attention-overlay.component';
import { LinearTimerComponent } from '../ui-components/linear-timer/linear-timer.component';
import { MainScreenFooterComponent } from '../ui-components/main-screen-footer/main-screen-footer.component';
import { MainScreenToolbarComponent } from '../ui-components/main-screen-toolbar/main-screen-toolbar.component';
import { NumberTimerComponent } from '../ui-components/number-timer/number-timer.component';
import { RadialTimerComponent } from '../ui-components/radial-timer/radial-timer.component';

const ActivityComponents = [
  MainScreenTitleActivityComponent,
  MainScreenFeedbackActivityComponent,
  ...BrainStormComponents,
  MainScreenPopQuizComponent,
  MainScreenToolbarComponent,
  NumberTimerComponent,
  MainScreenFooterComponent,
];
export const Components = [
  ...CmpComponents,
  ...Directives,
  ...Dialogs,
  ...ActivityComponents,
  BTwemojiComponent,
  LinearTimerComponent,
  RadialTimerComponent,
  AttentionOverlayComponent,
];

export const EntryComponents = [...Dialogs, ...CmpEntryComponents, ...ActivityComponents];
