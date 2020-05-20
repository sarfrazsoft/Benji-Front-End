import { UserGroup } from './generic-roleplay';
import { Report } from './reports';

export interface CaseStudyReport extends Report {
  case_study_details: string;
  casestudyquestion_set: Array<{ id: number; question_text: string }>;
  casestudyuser_set: Array<CaseStudyUser>;
  groups: Array<CaseStudyGroup>;
  mainscreen_instructions: number;
  note_taker_instructions: number;
  participant_instructions: number;
}

export interface CaseStudyGroup {
  group_num: any;
  id: number;
  usergroupuser_set: Array<UserGroup>;
}

export interface CaseStudyUser {
  benjiuser_id: number;
  usergroupuser: number;
  role: string;
  is_done: boolean;
  casestudyanswer_set: Array<{ answer: string; casestudyquestion: number }>;
}
