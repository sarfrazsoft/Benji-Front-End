import { BrainStormingComponents } from './brainstorming-activity';
import { BuildPitchComponents } from './build-pitch-activity';
import { ParticipantCaseStudyActivityComponent } from './case-study-activity/case-study-activity.component';
import { ParticipantDiscussionActivityComponent } from './discussion-activity/discussion-activity.component';
import { ParticipantEitherOrActivityComponent } from './either-or-activity/either-or-activity.component';
import { ParticipantExternalGroupingActivityComponent } from './external-grouping-activity/external-grouping-activity.component';
import { ParticipantFeedbackActivityComponent } from './feedback-activity/feedback-activity.component';
import { ParticiapantGatherActivityComponent } from './gather-activity/gather-activity.component';
import { ParticipantGeneratePitchActivityComponent } from './generate-pitch-activity/generate-pitch-activity.component';
import { ParticipantGenericRoleplayActivityComponent } from './generic-roleplay-activity/generic-roleplay-activity.component';
import { ParticipantHintActivityComponent } from './hint-activity/hint-activity.component';
import { ParticipantLobbyComponents } from './lobby-activity';
import { ParticipantMcqActivityComponent } from './mcq-activity/mcq-activity.component';
import { ParticipantMcqresultActivityComponent } from './mcqresult-activity/mcqresult-activity.component';
import { ParticipantPairActivityComponent } from './pair-activity/pair-activity.component';
import { ParticipantPairGroupingActivityComponent } from './pair-grouping-activity/pair-grouping-activity.component';
import { ParticipantLessonComponent } from './participant-lesson.component';
import { ParticipantPopQuizComponent } from './pop-quiz/pop-quiz.component';
import { ReorderComponents } from './reorder-activity';
import { ParticipantTeletriviaActivityComponent } from './teletrivia-activity/teletrivia-activity.component';
import { ParticipantTitleActivityComponent } from './title-activity/title-activity.component';
import { ParticipantTriadGroupingActivityComponent } from './triad-grouping-activity/triad-grouping-activity.component';
import { ParticipantVideoActivityComponent } from './video-activity/video-activity.component';

import { ParticipantSharedComponents } from './shared';

export { ParticipantLessonComponent };

export const ParticipantScreenComponents = [
  ...BuildPitchComponents,
  ...ParticipantSharedComponents,
  ...BrainStormingComponents,
  ...ReorderComponents,
  ...ParticipantLobbyComponents,
  ParticiapantGatherActivityComponent,
  ParticipantDiscussionActivityComponent,
  ParticipantEitherOrActivityComponent,
  ParticipantExternalGroupingActivityComponent,
  ParticipantFeedbackActivityComponent,
  ParticipantGeneratePitchActivityComponent,
  ParticipantHintActivityComponent,
  ParticipantLessonComponent,
  ParticipantMcqActivityComponent,
  ParticipantMcqresultActivityComponent,
  ParticipantPairActivityComponent,
  ParticipantPairGroupingActivityComponent,
  ParticipantPopQuizComponent,
  ParticipantTeletriviaActivityComponent,
  ParticipantTitleActivityComponent,
  ParticipantTriadGroupingActivityComponent,
  ParticipantVideoActivityComponent,
  ParticipantGenericRoleplayActivityComponent,
  ParticipantCaseStudyActivityComponent,
];
