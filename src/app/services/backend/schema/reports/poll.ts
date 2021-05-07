import { MCQActivityParticipantAnswerSet, Question } from './MCQ';
import { Report } from './reports';

export interface PollReport extends Report {
  pollactivityparticipantanswer_set: Array<MCQActivityParticipantAnswerSet>;
  question: Question;
}
