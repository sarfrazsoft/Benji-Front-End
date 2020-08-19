import { Report } from './reports';

export interface BrainstormReport extends Report {
  brainstormcategory_set: Array<any>;
  instructions: string;
  max_user_submissions: number;
  max_user_votes: number;
  submission_seconds: number;
  voting_seconds: number;
}
