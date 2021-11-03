import { AssessmentBarComponent } from './assessment-bar/assessment-bar.component';
import { AvatarComponent } from './avatar/avatar.component';
import { FeedbackGraphComponent } from './feedback-graph/feedback-graph.component';
import { ReportMCQComponent } from './feedback-graph/mcq/report-mcq.component';
import { QuestionComponent } from './feedback-graph/question/question.component';
import { TextQuestionComponent } from './feedback-graph/text-question/text-question.component';
import { FeedbackGenericGraphComponent } from './generic-feedback-graph/generic-feedback-graph.component';
import { GroupingComponent as ParticipantGroupingComponent } from './grouping/grouping.component';
import { PercentPollBarsComponent } from './percent-poll-bars/percent-poll-bars.component';
import { ResponsePercentBarsComponent } from './response-percent-bars/response-percent-bars.component';
import { ResponseTagsPercentBarsComponent } from './response-tags-percent-bars/response-tags-percent-bars.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
export { AvatarComponent };

export const CmpComponents = [
  ParticipantGroupingComponent,
  QuestionComponent,
  ReportMCQComponent,
  AvatarComponent,
  AssessmentBarComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent,
  PercentPollBarsComponent,
  TextQuestionComponent,
  FeedbackGenericGraphComponent,
  ResponseTagsPercentBarsComponent,
  TextEditorComponent,
];

export const CmpEntryComponents = [
  AssessmentBarComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent,
  PercentPollBarsComponent,
  FeedbackGenericGraphComponent,
  ResponseTagsPercentBarsComponent,
];
