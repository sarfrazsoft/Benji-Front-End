export * from './learner.component';
export * from './learner-report/learner-report.component';

import {
  LearnerReportComponents,
  LearnerReportEntryComponents
} from './learner-report';
import { LearnerComponent } from './learner.component';
import { SessionsComponent } from './sessions/sessions.component';

import { DonutComponent } from './skill-evaluation/donut/donut.component';
import { SkillEvaluationComponent } from './skill-evaluation/skill-evaluation.component';
import { SkillLineChartComponent } from './skill-evaluation/skill-line-chart/skill-line-chart.component';
import { SkillOverviewComponent } from './skill-evaluation/skill-overview/skill-overview.component';

export const LearnerComponents = [
  ...LearnerReportComponents,
  LearnerComponent,
  SessionsComponent,
  DonutComponent,
  SkillEvaluationComponent,
  SkillOverviewComponent,
  SkillLineChartComponent
];

export const LearnerEntryComponents = [...LearnerReportEntryComponents, SkillOverviewComponent];

export const LearnersProviders = [];
