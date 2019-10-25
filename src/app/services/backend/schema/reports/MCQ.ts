import { User } from '../user';

export interface MCQReport {
  mcqactivityuseranswer_set: Array<MCQActivityUserAnswerSet>;
  question: Question;
}

export interface Question {
  id: number;
  question: string;
  mcqchoice_set: Array<MCQChoiceSet>;
}

export interface MCQChoiceSet {
  id: number;
  order: number;
  choice_text: string;
  is_correct: boolean;
  explanation: string;
}

export interface MCQActivityUserAnswerSet {
  user: User;
  answer: number;
}
