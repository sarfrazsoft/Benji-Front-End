import { Component, Input, OnInit } from '@angular/core';
import {
  ActivityReport,
  Assessment,
  FeedbackGraphQuestion,
  FeedbackQuestion,
  PitchoMaticGroupMemberFeedback
} from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';

@Component({
  selector: 'benji-pitch-evaluation',
  templateUrl: './pitch-evaluation.component.html',
  styleUrls: ['./pitch-evaluation.component.scss']
})
export class PitchEvaluationComponent implements OnInit {
  @Input() pomData: ActivityReport;
  questions: Array<FeedbackGraphQuestion> = [];

  constructor() { }

  ngOnInit() {
    this.updateFeedbackData();
  }

  updateFeedbackData() {
    const currentUserID = 2;
    let currentMember: PitchoMaticGroupMemberFeedback;
    const otherMembers: Array<PitchoMaticGroupMemberFeedback> = [];

    this.pomData.pom.pitchomaticgroupmembers.forEach(m => {
      if (m.user.id === currentUserID) {
        currentMember = m;
      } else {
        otherMembers.push(m);
      }
    });

    this.questions = [];
    const fback = this.pomData.pom.feedbackquestion_set;

    fback.forEach((question: FeedbackQuestion) => {
      const assessments: Array<Assessment> = [];
      currentMember.pitchomaticfeedback_set.forEach(response => {
        if (response.feedbackquestion === question.id) {
          assessments.push({
            user: otherMembers.filter(u => u.user.id === response.user)[0].user,
            rating: response.rating_answer,
            text: response.text_answer
          });
        }
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
        combo_text: ''
      });
    });
  }
}
