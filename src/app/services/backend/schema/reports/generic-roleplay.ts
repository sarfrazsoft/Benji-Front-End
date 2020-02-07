import { User } from '../user';
import { FeedbackQuestion } from '../utils';
import { FeedbackUserAnswerSet } from './feedback';
import { Report } from './reports';

export interface GenericRoleplayReport extends Report {
  groups: Array<GenericRoleplayGroup>;
  genericroleplayrole_set: Array<GenericRoleplayRole>;
  activity_seconds: number;
  feedback_seconds: number;
  genericroleplayuser_set: Array<AssignedRole>;
  feedback: Array<GenericRoleplayFeedback>;
}

export interface GenericRoleplayFeedback {
  benji_user: number;
  rating_answer: number;
  text_answer: string;
  feedbackquestion: number;
}

export interface GenericRoleplayGroup {
  id: number;
  usergroupuser_set: Array<UserGroup>;
}

export interface UserGroup {
  id: number;
  user: User;
  found: boolean;
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
  benjiuser_id: number;
  role: number;
  discussion_complete: boolean;
  feedback_submitted: boolean;
}
