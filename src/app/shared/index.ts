export * from './components';
export * from './directives';
export * from './dialogs';

import { UIComponents } from '../ui-components';
import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';
import { CustomMenuComponent } from './ngx-editor/custom-menu/custom-menu.component';

import {
  MainScreenBrainStormComponents,
  MainScreenBuildPitchActivityComponent,
  MainScreenConvoCardsActivityComponent,
  MainScreenFeedbackActivityComponent,
  MainScreenPollComponent,
  MainScreenPopQuizComponent,
  MainScreenTitleActivityComponent,
} from 'src/app/pages/lesson/main-screen';

import {
  BuildPitchComponents,
  CaseStudyGroupingComponent,
  CaseStudyWorkAreaComponent,
  ParticipantBrainStormComponents,
  ParticipantBrainstormingActivityComponent,
  ParticipantBuildPitchActivityComponent,
  ParticipantCaseStudyActivityComponent,
  ParticipantConvoCardsActivityComponent,
  ParticipantFeedbackActivityComponent,
  ParticipantGroupingToolComponent,
  // ParticipantSharedComponents,
  ParticipantInstructionTemplateComponent,
  ParticipantPollComponent,
  ParticipantPopQuizComponent,
  ParticipantSharingToolComponent,
  ParticipantTitleActivityComponent,
  QuestionFormComponent,
  QuestionLayoutComponent,
  VoteIdeaComponent,
  VotePitchComponent,
} from 'src/app/pages/lesson/participant';

const ActivityComponents = [
  ParticipantFeedbackActivityComponent,
  ParticipantTitleActivityComponent,
  ParticipantPopQuizComponent,
  ParticipantCaseStudyActivityComponent,
  CaseStudyGroupingComponent,
  CaseStudyWorkAreaComponent,
  ParticipantInstructionTemplateComponent,
  QuestionFormComponent,
  QuestionLayoutComponent,
  ParticipantSharingToolComponent,
  ParticipantGroupingToolComponent,
  ParticipantBuildPitchActivityComponent,
  ParticipantConvoCardsActivityComponent,
  ParticipantPollComponent,
  VotePitchComponent,
  // ...ParticipantSharedComponents,
  ...ParticipantBrainStormComponents,
  ParticipantBrainstormingActivityComponent,
  VoteIdeaComponent,
  // ...BuildPitchComponents,
  MainScreenBuildPitchActivityComponent,
  MainScreenTitleActivityComponent,
  MainScreenFeedbackActivityComponent,
  MainScreenConvoCardsActivityComponent,
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
];

export const EntryComponents = [...Dialogs, ...CmpEntryComponents, ...ActivityComponents];
