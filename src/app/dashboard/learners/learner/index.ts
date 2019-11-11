export * from './learner.component';
export * from './learner-report/learner-report.component';

import { LearnerReportComponent } from './learner-report/learner-report.component';
import { McqComponent as McqLearnerComponent } from './learner-report/mcq/mcq.component';
import { PitchOMaticComponent as LearnerPitchOMaticComponent } from './learner-report/pitch-o-matic/pitch-o-matic.component';
import { LearnerComponent } from './learner.component';
import { SessionsComponent } from './sessions/sessions.component';

import { DonutComponent } from './skill-evaluation/donut/donut.component';
import { SkillEvaluationComponent } from './skill-evaluation/skill-evaluation.component';
import { SkillLineChartComponent } from './skill-evaluation/skill-line-chart/skill-line-chart.component';
import { SkillOverviewComponent } from './skill-evaluation/skill-overview/skill-overview.component';

export const LearnerComponents = [
  McqLearnerComponent,
  LearnerPitchOMaticComponent,
  LearnerComponent,
  LearnerReportComponent,
  SessionsComponent,
  DonutComponent,
  SkillEvaluationComponent,
  SkillOverviewComponent,
  SkillLineChartComponent
];

export const LearnersEntryComponents = [];

export const LearnersProviders = [];
