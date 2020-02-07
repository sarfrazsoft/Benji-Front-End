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
  feedbackuseranswer_set: Array<FeedbackUserAnswerSet>;
  id: number;
  is_combo: boolean;
  pitchomaticactivity?: any;
  question_text: string;
  question_type: string;
}

export enum QuestionType {
  rating_happysad,
  rating_agreedisagree,
  text
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
  user: User;
  rating: number;
  text: string;
}

export interface FeedbackUserAnswerSet {
  user: User;
  rating_answer: number;
  text_answer: string;
  feedbackquestion: number;
}
