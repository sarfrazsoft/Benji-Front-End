// import { ParticipantBrainStormComponents } from './brainstorming-activity';
// import { BuildPitchComponents } from './build-pitch-activity';
// import { ParticipantCaseStudyActivityComponent } from './case-study-activity/
// case-study-activity.component';
import { ParticipantConvoCardsActivityComponent } from './convo-cards-activity/convo-cards-activity.component';
import { ParticipantDiscussionActivityComponent } from './discussion-activity/discussion-activity.component';
import { ParticipantEitherOrActivityComponent } from './either-or-activity/either-or-activity.component';
import { ParticipantExternalGroupingActivityComponent } from './external-grouping-activity/external-grouping-activity.component';
// import { ParticipantFeedbackActivityComponent } from './feedback-activity/feedback-activity.component';
import { ParticiapantGatherActivityComponent } from './gather-activity/gather-activity.component';
import { ParticipantGeneratePitchActivityComponent } from './generate-pitch-activity/generate-pitch-activity.component';
import { ParticipantGenericRoleplayActivityComponent } from './generic-roleplay-activity/generic-roleplay-activity.component';
import { ParticipantHintActivityComponent } from './hint-activity/hint-activity.component';
import { ParticipantImageActivityComponent } from './image-activity/image-activity.component';
import { ParticipantLobbyComponents } from './lobby-activity';
import { ParticipantMcqActivityComponent } from './mcq-activity/mcq-activity.component';
import { ParticipantMcqresultActivityComponent } from './mcqresult-activity/mcqresult-activity.component';
import { ParticipantMontyHallActivityComponent } from './monty-hall-activity/monty-hall-activity.component';
import { ParticipantPairActivityComponent } from './pair-activity/pair-activity.component';
import { ParticipantPairGroupingActivityComponent } from './pair-grouping-activity/pair-grouping-activity.component';
import { ParticipantLessonComponent } from './participant-lesson.component';
// import { ParticipantPopQuizComponent } from './pop-quiz/pop-quiz.component';
import { ReorderComponents } from './reorder-activity';
import { SessionEndComponent } from './session-end/session-end.component';
import { ParticipantTeletriviaActivityComponent } from './teletrivia-activity/teletrivia-activity.component';
// import { ParticipantTitleActivityComponent } from './title-activity/title-activity.component';
import { ParticipantTriadGroupingActivityComponent } from './triad-grouping-activity/triad-grouping-activity.component';
import { ParticipantVideoActivityComponent } from './video-activity/video-activity.component';

export { ParticipantConvoCardsActivityComponent } from './convo-cards-activity/convo-cards-activity.component';
export { SessionEndComponent } from './session-end/session-end.component';
export { ParticipantSharedComponents } from './shared';
export { ParticipantInstructionTemplateComponent } from './shared/instruction-template/instruction-template.component';
export { QuestionFormComponent } from './shared/question-form/question-form.component';
export { QuestionLayoutComponent } from './shared/question-layout/question-layout.component';
export { ParticipantCaseStudyActivityComponent } from './case-study-activity/case-study-activity.component';
export { ParticipantPopQuizComponent } from './pop-quiz/pop-quiz.component';
export { ParticipantFeedbackActivityComponent } from './feedback-activity/feedback-activity.component';
export { ParticipantLessonComponent };

export { ParticipantBrainStormComponents } from './brainstorming-activity';
export { ParticipantBrainstormingActivityComponent } from './brainstorming-activity/brainstorming-activity.component';
export { VoteIdeaComponent } from './brainstorming-activity/vote-idea/vote-idea.component';

export { ParticipantTitleActivityComponent } from './title-activity/title-activity.component';
export { BuildPitchComponents } from './build-pitch-activity';
export { VotePitchComponent } from './build-pitch-activity/vote-pitch/vote-pitch.component';
export { ParticipantBuildPitchActivityComponent } from './build-pitch-activity/build-pitch-activity.component';

export { IdeaContainerComponent } from './brainstorming-activity/idea-container/idea-container.component';
export const ParticipantScreenComponents = [
  // ...BuildPitchComponents,
  // ...ParticipantSharedComponents,
  // ...BrainStormingComponents,
  ...ReorderComponents,
  ...ParticipantLobbyComponents,
  ParticiapantGatherActivityComponent,
  ParticipantImageActivityComponent,
  ParticipantDiscussionActivityComponent,
  ParticipantEitherOrActivityComponent,
  ParticipantExternalGroupingActivityComponent,
  ParticipantMontyHallActivityComponent,
  // ParticipantFeedbackActivityComponent,
  ParticipantGeneratePitchActivityComponent,
  ParticipantHintActivityComponent,
  ParticipantLessonComponent,
  ParticipantMcqActivityComponent,
  ParticipantMcqresultActivityComponent,
  ParticipantPairActivityComponent,
  ParticipantPairGroupingActivityComponent,
  // ParticipantPopQuizComponent,
  ParticipantTeletriviaActivityComponent,
  // ParticipantTitleActivityComponent,
  ParticipantTriadGroupingActivityComponent,
  ParticipantVideoActivityComponent,
  ParticipantGenericRoleplayActivityComponent,
  SessionEndComponent,
  // ParticipantCaseStudyActivityComponent,
];
