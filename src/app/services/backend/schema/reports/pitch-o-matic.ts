import { ParticipantCode, PitchoMaticBlank, PitchoMaticGroupMemberPitch } from '../activities/activities';
import { User } from '../user';
import { FeedbackQuestion } from '../utils';
import { Report } from './reports';

export interface PitchOMaticReport extends Report {
  feedbackquestion_set: Array<FeedbackQuestion>;
  instructions: string;
  pitchomaticblank_set: Array<PitchoMaticBlank>;
  pitchomaticgroupmembers: Array<PitchoMaticGroupMemberFeedback>;
}

export interface PitchoMaticGroupMemberFeedback {
  participant: ParticipantCode;
  pitch_prep_text: string;
  pitch: PitchoMaticGroupMemberPitch;
  pitchomaticfeedback_set: PitchomaticfeedbackSet[];
}

export interface PitchomaticfeedbackSet {
  participant: ParticipantCode;
  feedbackquestion: number;
  rating_answer: number;
  text_answer: string;
}
