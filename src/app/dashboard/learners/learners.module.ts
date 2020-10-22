import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LearnersComponents, LearnersEntryComponents, LearnersProviders } from './index';
import { PeerFeedbackComponent } from './learner/learner-report/pitch-o-matic/peer-feedback/peer-feedback.component';
import { PitchDetailsComponent } from './learner/learner-report/pitch-o-matic/pitch-details/pitch-details.component';
import { PitchEvaluationComponent } from './learner/learner-report/pitch-o-matic/pitch-evaluation/pitch-evaluation.component';
import { SkillDetailComponent } from './learner/skill-evaluation/skill-detail/skill-detail.component';
import { LearnersRoutes } from './learners.routing';

@NgModule({
  imports: [CommonModule, LearnersRoutes, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [RouterModule],
  declarations: [
    LearnersComponents,
    SkillDetailComponent,
    PitchDetailsComponent,
    PitchEvaluationComponent,
    PeerFeedbackComponent,
  ],
  entryComponents: LearnersEntryComponents,
  providers: LearnersProviders,
})
export class LearnersModule {}

export function LearnersEntrypoint() {
  return LearnersModule;
}
