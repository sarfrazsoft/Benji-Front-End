import { PitchoMaticBlank, PitchoMaticGroupMemberPitch } from '../activities';
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
  user: User;
  pitch_prep_text: string;
  pitch: PitchoMaticGroupMemberPitch;
  pitchomaticfeedback_set: PitchomaticfeedbackSet[];
}

export interface PitchomaticfeedbackSet {
  user: number;
  feedbackquestion: number;
  rating_answer: number;
  text_answer: string;
}
