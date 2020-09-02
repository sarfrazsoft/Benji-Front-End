import { Group, ParticipantCode } from '../activities';
import { FeedbackQuestion } from '../utils';
import { Report } from './reports';

export interface GenericRoleplayReport extends Report {
  groups: Array<Group>;
  genericroleplayrole_set: Array<GenericRoleplayRole>;
  activity_seconds: number;
  feedback_seconds: number;
  genericroleplayparticipant_set: Array<AssignedRole>;
  feedback: Array<GenericRoleplayFeedback>;
}

export interface GenericRoleplayFeedback {
  genericroleplayparticipant: AssignedRole;
  rating_answer: number;
  text_answer: string;
  feedbackquestion: number;
}

export interface GenericRoleplayRole {
  id: number;
  name: string;
  image_url: string;
  instructions: string;
  allow_multiple: boolean;
  is_non_interactive: boolean;
  feedbackquestions: Array<FeedbackQuestion>;
}

export interface AssignedRole {
  participant: ParticipantCode;
  role: number;
  discussion_complete: boolean;
  feedback_submitted: boolean;
}
