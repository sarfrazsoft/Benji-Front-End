import { CaseStudyRole, Group, ParticipantCode } from '../activities/activities';
import { Report } from './reports';

export interface CaseStudyReport extends Report {
  case_study_details: string;
  casestudyquestion_set: Array<{ id: number; question_text: string }>;
  casestudyparticipant_set: Array<CaseStudyUser>;
  groups: Array<Group>;
  mainscreen_instructions: number;
  note_taker_instructions: number;
  participant_instructions: number;
}

export interface CaseStudyUser {
  participant: ParticipantCode;
  role: CaseStudyRole;
  is_done: boolean;
  casestudyanswer_set: Array<{ answer: string; casestudyquestion: number }>;
}
