import { ParticipantCode } from '../activities/activities';
import { Report } from './reports';

export interface BuildAPitchReport extends Report {
  buildapitchblank_set: Array<BuildAPitchBlankSet>;
  pitch_summaries: Array<PitchSummary>;
  winning_participant: ParticipantCode;
}

export interface BuildAPitchBlankSet {
  id: number;
  order: number;
  label: string;
  temp_text: string;
  help_text: string;
}

export interface PitchSummary {
  participant: ParticipantCode;
  buildapitchentry_set: Array<BuildAPitchEntrySet>;
  votes: number;
}

export interface BuildAPitchEntrySet {
  buildapitchblank: number;
  value: string;
}
