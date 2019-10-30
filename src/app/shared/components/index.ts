import { AvatarComponent } from './avatar/avatar.component';

import { AssessmentBarComponent } from './assessment-bar/assessment-bar.component';
import { FeedbackGraphComponent } from './feedback-graph/feedback-graph.component';
import { QuestionComponent } from './feedback-graph/question/question.component';
import { ResponsePercentBarsComponent } from './response-percent-bars/response-percent-bars.component';

export { AvatarComponent };

export const CmpComponents = [
  QuestionComponent,
  AvatarComponent,
  AssessmentBarComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent
];

export const CmpEntryComponents = [
  AssessmentBarComponent,
  FeedbackGraphComponent,
  ResponsePercentBarsComponent
];
