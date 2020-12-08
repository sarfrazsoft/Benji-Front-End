export * from './components';
export * from './directives';
export * from './dialogs';

import { UIComponents } from '../ui-components';
import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';

import {
  MainScreenBrainStormComponents,
  MainScreenBuildPitchActivityComponent,
  MainScreenFeedbackActivityComponent,
  MainScreenPopQuizComponent,
  MainScreenTitleActivityComponent,
} from 'src/app/pages/lesson/main-screen';

import {
  BuildPitchComponents,
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
  ...BuildPitchComponents,
  MainScreenBuildPitchActivityComponent,
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
