import { ParticipantGroupingToolComponent } from './grouping-tool/grouping-tool.component';
import { ParticipantInstructionTemplateComponent } from './instruction-template/instruction-template.component';
import { ParticipantFeedbackMCQComponent } from './question-form/mcq/mcq.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { QuestionLayoutComponent } from './question-layout/question-layout.component';
import { ParticipantSharingToolComponent } from './sharing-tool/sharing-tool.component';

export const ParticipantSharedComponents = [
  ParticipantInstructionTemplateComponent,
  QuestionFormComponent,
  ParticipantFeedbackMCQComponent,
  QuestionLayoutComponent,
  ParticipantSharingToolComponent,
  ParticipantGroupingToolComponent,
];

export const ParticipantSharedEntryComponents = [ParticipantFeedbackMCQComponent];
