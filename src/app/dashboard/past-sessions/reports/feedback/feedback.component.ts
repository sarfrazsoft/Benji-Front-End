import { Component, Input, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import {
  ActivityReport,
  Assessment,
  FeedbackGraphQuestion,
  FeedbackQuestionSet,
  FeedbackUserAnswerSet
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() data: ActivityReport;

  fback: Array<FeedbackQuestionSet>;
  questions: Array<FeedbackGraphQuestion> = [];

  constructor(
    private pastSessionService: PastSessionsService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.data && this.data.feedback) {
      this.updateFeedbackData();
    }
  }

  updateFeedbackData() {
    this.questions = [];
    this.fback = this.data.feedback.feedbackquestion_set;

    this.fback.forEach((question: FeedbackQuestionSet) => {
      const assessments: Array<Assessment> = [];
      question.feedbackuseranswer_set.forEach(
        (answer: FeedbackUserAnswerSet) => {
          assessments.push({
            user: answer.user,
            rating: answer.rating_answer,
            text: answer.text_answer
          });
        }
      );

      this.questions.push({
        question_text: question.question_text,
        assessments: assessments,
        labels: [
          'Strongly Disagree',
          'Disagree',
          'Neutral',
          'Agree',
          'Strongly Agree'
        ],
        is_combo: question.is_combo,
        question_type: question.question_type,
        combo_text: question.combo_text
      });
    });
  }
}
