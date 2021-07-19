import { User } from '../user';
import { TitleComponent } from '../utils';
import { Report } from './reports';

export interface FeedbackReport extends Report {
  feedbackquestion_set: Array<FeedbackQuestionSet>;
  titlecomponent: TitleComponent;
}

export interface FeedbackQuestionSet {
  average_rating: string;
  combo_text: string;
  feedbackactivity: number;
  feedbackparticipantanswer_set: Array<FeedbackParticipantAnswerSet>;
  id: number;
  is_combo: boolean;
  pitchomaticactivity?: any;
  question_text: string;
  question_type: string;
}

export enum QuestionType {
  rating_happysad,
  rating_agreedisagree,
  text,
  scale,
  multiple_choice,
}

export interface FeedbackGraphQuestion {
  question_text: string;
  assessments: Array<Assessment>;
  labels: Array<string>;
  is_combo: boolean;
  combo_text: string;
  question_type: string;
}

export interface Assessment {
  participant_code: number;
  rating: number;
  text: string;
  scale: [],
  multiple_choice: {},
}

export interface FeedbackParticipantAnswerSet {
  participant: { participant_code: number };
  rating_answer: number;
  text_answer: string;
  scale_answer: [];
  mcq_answer: {};
  feedbackquestion: number;
}
