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
  feedbackuseranswer_set: Array<any>;
  id: number;
  is_combo: boolean;
  pitchomaticactivity?: any;
  question_text: string;
  question_type: QuestionType;
}

export enum QuestionType {
  rating_happysad,
  rating_agreedisagree,
  text_only
}

export interface FeedbackGraphQuestion {
  question_text: string;
  assessments: Array<number>;
  labels: Array<string>;
  is_combo: boolean;
  combo_text: string;
  combo_answers: Array<string>;
}
