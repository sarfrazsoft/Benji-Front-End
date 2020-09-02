import { Component, Input, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import {
  ActivityReport,
  Assessment,
  FeedbackGraphQuestion,
  FeedbackQuestion,
  PitchoMaticGroupMemberFeedback,
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-pitch-evaluation',
  templateUrl: './pitch-evaluation.component.html',
  styleUrls: ['./pitch-evaluation.component.scss'],
})
export class PitchEvaluationComponent implements OnInit {
  @Input() pomData: ActivityReport;
  questions: Array<FeedbackGraphQuestion> = [];

  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.updateFeedbackData();
    });
    // this.updateFeedbackData();
  }

  updateFeedbackData() {
    const currentUserIDs = this.pastSessionService.filteredInUsers;
    const currentMembersFB: Array<PitchoMaticGroupMemberFeedback> = [];
    const otherMembers: Array<PitchoMaticGroupMemberFeedback> = [];

    this.pomData.pom.pitchomaticgroupmembers.forEach((m) => {
      otherMembers.push(m);
      if (currentUserIDs.find((id) => id === m.participant.participant_code)) {
        currentMembersFB.push(m);
      }
    });

    this.questions = [];
    const fbackQuestions = this.pomData.pom.feedbackquestion_set;

    fbackQuestions.forEach((question: FeedbackQuestion) => {
      const assessments: Array<Assessment> = [];
      currentMembersFB.forEach((currentMember) => {
        currentMember.pitchomaticfeedback_set.forEach((response) => {
          if (response.feedbackquestion === question.id) {
            assessments.push({
              participant_code: otherMembers.filter(
                (u) => u.participant.participant_code === response.participant.participant_code
              )[0].participant.participant_code,
              rating: response.rating_answer,
              text: response.text_answer,
            });
          }
        });
      });
      // console.log(assessments);

      this.questions.push({
        question_text: question.question_text,
        assessments: assessments,
        labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        question_type: question.question_type,
        is_combo: question.is_combo,
        combo_text: '',
      });
    });
  }
}
