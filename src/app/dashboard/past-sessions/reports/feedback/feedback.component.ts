import { Component, Input, OnInit } from '@angular/core';
import {
  ActivityReport,
  FeedbackGraphQuestion,
  FeedbackQuestionSet
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

  constructor() {}

  ngOnInit() {
    if (this.data && this.data.feedback) {
      this.fback = this.data.feedback.feedbackquestion_set;

      this.fback.forEach(question => {
        const assessments = [0, 0, 0, 0, 0];
        const textAnswers = [];
        question.feedbackuseranswer_set.forEach(answer => {
          assessments[answer.rating_answer - 1]++;
          textAnswers.push(answer.text_answer);
        });

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
          combo_text: question.combo_text,
          combo_answers: textAnswers
        });
      });
    }
  }
}
