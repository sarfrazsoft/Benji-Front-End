import { LearnerReportComponent } from './learner-report.component';
import { McqComponent as McqLearnerComponent } from './mcq/mcq.component';
import { PeerFeedbackComponent } from './pitch-o-matic/peer-feedback/peer-feedback.component';
import { PitchDetailsComponent } from './pitch-o-matic/pitch-details/pitch-details.component';
import { PitchEvaluationComponent } from './pitch-o-matic/pitch-evaluation/pitch-evaluation.component';
import { PitchOMaticComponent as LearnerPitchOMaticComponent } from './pitch-o-matic/pitch-o-matic.component';

export const LearnerReportComponents = [
  McqLearnerComponent,
  LearnerPitchOMaticComponent,
  PeerFeedbackComponent,
  LearnerReportComponent,
  PitchDetailsComponent,
  PitchEvaluationComponent
];

export const LearnerReportEntryComponents = [LearnerPitchOMaticComponent];

export const LearnersReportProviders = [];
