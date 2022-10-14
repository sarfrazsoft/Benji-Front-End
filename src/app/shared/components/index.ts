import { AssessmentBarComponent } from './assessment-bar/assessment-bar.component';
import { AvatarComponent } from './avatar/avatar.component';
import { BenjiProfilePicturesComponent } from './benji-profile-pictures/benji-profile-pictures.component';
import { FeedbackGraphComponent } from './feedback-graph/feedback-graph.component';
import { ReportMCQComponent } from './feedback-graph/mcq/report-mcq.component';
import { QuestionComponent } from './feedback-graph/question/question.component';
import { TextQuestionComponent } from './feedback-graph/text-question/text-question.component';
import { FeedbackGenericGraphComponent } from './generic-feedback-graph/generic-feedback-graph.component';
import { GroupingComponent as ParticipantGroupingComponent } from './grouping/grouping.component';
import { IdeaDetailedComponent } from './idea-detailed/idea-detailed';
import { PercentPollBarsComponent } from './percent-poll-bars/percent-poll-bars.component';
import { ProgressbarComponent } from './progress-bar/progress-bar.component';
import { ResponsePercentBarsComponent } from './response-percent-bars/response-percent-bars.component';
import { ResponseTagsPercentBarsComponent } from './response-tags-percent-bars/response-tags-percent-bars.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { TipTapEditorComponents } from './tiptap-editor';
import { UploadcareWidgetComponent } from './uploadcare-widget/uploadcare-widget.component';
import { UppyDashboardComponent } from './uppy-dashboard/uppy-dashboard.component';
export { AvatarComponent };

export const CmpComponents = [
  ParticipantGroupingComponent,
  QuestionComponent,
  ReportMCQComponent,
  AvatarComponent,
  AssessmentBarComponent,
  BenjiProfilePicturesComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent,
  PercentPollBarsComponent,
  TextQuestionComponent,
  FeedbackGenericGraphComponent,
  ResponseTagsPercentBarsComponent,
  TextEditorComponent,
  IdeaDetailedComponent,
  UppyDashboardComponent,
  UploadcareWidgetComponent,
  ...TipTapEditorComponents,
  ProgressbarComponent,
];

export const CmpEntryComponents = [
  AssessmentBarComponent,
  BenjiProfilePicturesComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent,
  PercentPollBarsComponent,
  FeedbackGenericGraphComponent,
  ResponseTagsPercentBarsComponent,
];
