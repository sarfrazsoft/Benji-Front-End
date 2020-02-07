import { AssessmentBarComponent } from './assessment-bar/assessment-bar.component';
import { AvatarComponent } from './avatar/avatar.component';
import { FeedbackGraphComponent } from './feedback-graph/feedback-graph.component';
import { QuestionComponent } from './feedback-graph/question/question.component';
import { TextQuestionComponent } from './feedback-graph/text-question/text-question.component';
import { FeedbackGenericGraphComponent } from './generic-feedback-graph/generic-feedback-graph.component';
import { ResponsePercentBarsComponent } from './response-percent-bars/response-percent-bars.component';
export { AvatarComponent };

export const CmpComponents = [
  QuestionComponent,
  AvatarComponent,
  AssessmentBarComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent,
  TextQuestionComponent,
  FeedbackGenericGraphComponent
];

export const CmpEntryComponents = [
  AssessmentBarComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent,
  FeedbackGenericGraphComponent
];
