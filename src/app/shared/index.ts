export * from './components';
export * from './directives';
export * from './dialogs';

import { BTwemojiComponent } from '../ui-components/b-twemoji/b-twemoji.component';
import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';

import { BrainStormComponents, MainScreenTitleActivityComponent } from 'src/app/pages/lesson/main-screen';
import { AttentionOverlayComponent } from '../ui-components/linear-timer/attention-overlay/attention-overlay.component';
import { LinearTimerComponent } from '../ui-components/linear-timer/linear-timer.component';

export const ActivityComponents = [MainScreenTitleActivityComponent, ...BrainStormComponents];
export const Components = [
  ...CmpComponents,
  ...Directives,
  ...Dialogs,
  ...ActivityComponents,
  BTwemojiComponent,
  LinearTimerComponent,
  AttentionOverlayComponent,
];

export const EntryComponents = [...Dialogs, ...CmpEntryComponents, ...ActivityComponents];
