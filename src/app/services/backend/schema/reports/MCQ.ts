import { User } from '../user';
import { Report } from './reports';

export interface MCQReport extends Report {
  mcqactivityparticipantanswer_set: Array<MCQActivityParticipantAnswerSet>;
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

export interface MCQActivityParticipantAnswerSet {
  participant: { participant_code: number };
  answer: number;
}
