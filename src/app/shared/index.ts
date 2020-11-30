export * from './components';
export * from './directives';
export * from './dialogs';

import { UIComponents } from '../ui-components';
import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';

import {
  MainScreenBrainStormComponents,
  MainScreenFeedbackActivityComponent,
  MainScreenPopQuizComponent,
  MainScreenTitleActivityComponent,
} from 'src/app/pages/lesson/main-screen';

import {
  ParticipantBrainStormComponents,
  ParticipantFeedbackActivityComponent,
  ParticipantPopQuizComponent,
  ParticipantSharedComponents,
  ParticipantTitleActivityComponent,
} from 'src/app/pages/lesson/participant';

const ActivityComponents = [
  ParticipantFeedbackActivityComponent,
  ParticipantTitleActivityComponent,
  ParticipantPopQuizComponent,
  ...ParticipantSharedComponents,
  ...ParticipantBrainStormComponents,
  MainScreenTitleActivityComponent,
  MainScreenFeedbackActivityComponent,
  ...MainScreenBrainStormComponents,
  MainScreenPopQuizComponent,
];

export const Components = [
  ...CmpComponents,
  ...Directives,
  ...Dialogs,
  ...ActivityComponents,
  ...UIComponents,
];

export const EntryComponents = [...Dialogs, ...CmpEntryComponents, ...ActivityComponents];
