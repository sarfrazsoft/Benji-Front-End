import { User } from '../user';
import { Report } from './reports';

export interface BuildAPitchReport extends Report {
  buildapitchblank_set: Array<BuildAPitchBlankSet>;
  pitch_summaries: Array<PitchSummary>;
  winning_user: User;
}

export interface BuildAPitchBlankSet {
  id: number;
  order: number;
  label: string;
  temp_text: string;
  help_text: string;
}

export interface PitchSummary {
  user: number;
  buildapitchentry_set: Array<BuildAPitchEntrySet>;
  votes: number;
}

export interface BuildAPitchEntrySet {
  buildapitchblank: number;
  value: string;
}
