import { Component, Input, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import {
  ActivityReport,
  Assessment,
  FeedbackGraphQuestion,
  FeedbackParticipantAnswerSet,
  FeedbackQuestionSet,
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  @Input() data: ActivityReport;

  fback: Array<FeedbackQuestionSet>;
  questions: Array<FeedbackGraphQuestion | any> = [];

  responsePercentBarQuestions = [];

  constructor(private pastSessionService: PastSessionsService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.data && this.data.feedback) {
      this.updateFeedbackData();
    }
  }

  updateFeedbackData() {
    this.questions = [];
    this.responsePercentBarQuestions = [];
    this.fback = this.data.feedback.feedbackquestion_set;

    this.fback.forEach((question: FeedbackQuestionSet) => {
      let labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
      let label_icons;
      console.log(question);
      if (question.question_type === 'multiple_choice') {
        // over here we create data needed in
        // benji-response-percent-bars
        this.questions.push({
          questionText: question.question_text,
          lessonJoinedUsers: this.data.participant_set,
          lessonJoinedUsersLength: this.data.participant_set.length,
          questionRespondents: question.feedbackparticipantanswer_set,
          questionRespondentsLength: question.feedbackparticipantanswer_set.length,
          choiceSet: question.mcq_question.mcqchoice_set,
          question_type: question.question_type,
        });
      } else if (question.question_type === 'scale') {
      } else if (question.question_type === 'thumb_up') {
        labels = ['', ''];
        label_icons = ['thumb_up.svg', 'thumb_down.svg'];
        this.pushInAssessments(question, labels, label_icons);
      } else if (question.question_type === 'emoji') {
        labels = ['', '', '', '', ''];
        label_icons = [
          'very_dissatisfied.svg',
          'dissatisfied.svg',
          'unamused.svg',
          'satisfied.svg',
          'very_satisfied.svg',
        ];
        this.pushInAssessments(question, labels, label_icons);
      } else {
        this.pushInAssessments(question, labels, label_icons);
      }
    });
  }

  pushInAssessments(question, labels, label_icons) {
    const assessments: Array<Assessment> = [];
    question.feedbackparticipantanswer_set.forEach((answer: FeedbackParticipantAnswerSet) => {
      assessments.push({
        participant_code: answer.participant.participant_code,
        rating: answer.rating_answer,
        text: answer.text_answer,
        // scale: [],
        // multiple_choice: {},
      });
    });

    this.questions.push({
      question_text: question.question_text,
      assessments: assessments,
      labels: labels,
      label_icons: label_icons,
      is_combo: question.is_combo,
      question_type: question.question_type,
      combo_text: question.combo_text,
    });
  }
}
