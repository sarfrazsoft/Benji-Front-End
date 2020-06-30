import { Report } from './reports';

export interface BrainstormReport extends Report {
  idea_rankings: Array<any>;
  instructions: string;
  max_user_submissions: number;
  max_user_votes: number;
  submission_seconds: number;
  voting_seconds: number;
}
