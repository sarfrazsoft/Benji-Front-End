export * from './components';
export * from './directives';
export * from './dialogs';

import { MainScreenBrainStormComponents } from 'src/app/pages/lesson/main-screen';
import { MainScreenPollComponent, MainScreenPopQuizComponent } from 'src/app/pages/lesson/main-screen';
import { ParticipantLobbyComponents } from 'src/app/pages/participant';
import { SafeHtmlPipe } from '../services/safe-html.pipe';
import { SafePipe } from '../services/safe.pipe';
import { UIComponents } from '../ui-components';
import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';
import { CustomMenuComponent } from './ngx-editor/custom-menu/custom-menu.component';

const ActivityComponents = [
  ...MainScreenBrainStormComponents,
  MainScreenPopQuizComponent,
  MainScreenPollComponent,
];

const EditorComponents = [CustomMenuComponent];

export const Components = [
  ...EditorComponents,
  ...CmpComponents,
  ...Directives,
  ...Dialogs,
  ...ActivityComponents,
  ...UIComponents,
  ...ParticipantLobbyComponents,
  SafePipe,
  SafeHtmlPipe,
];

export const EntryComponents = [...Dialogs, ...CmpEntryComponents, ...ActivityComponents];
