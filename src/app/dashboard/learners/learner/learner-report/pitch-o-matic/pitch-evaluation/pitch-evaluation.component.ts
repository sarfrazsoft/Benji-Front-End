import { Component, Input, OnInit } from "@angular/core";
import {
  ActivityReport,
  Assessment,
  FeedbackGraphQuestion,
  FeedbackQuestion,
  FeedbackQuestionSet,
  FeedbackUserAnswerSet,
  Pitchomaticgroupmember,
  PitchoMaticGroupMember
} from "src/app/services/backend/schema";
import { PastSessionsService } from "src/app/services/past-sessions.service";

@Component({
  selector: "benji-pitch-evaluation",
  templateUrl: "./pitch-evaluation.component.html",
  styleUrls: ["./pitch-evaluation.component.scss"]
})
export class PitchEvaluationComponent implements OnInit {
  @Input() pomData: ActivityReport;
  // name = '';
  // otherMembers = [];
  currentMember: Pitchomaticgroupmember;
  // questions: Array<FeedbackQuestion> = [];

  fback: Array<FeedbackQuestion>;
  questions: Array<FeedbackGraphQuestion> = [];
  constructor(private pastSessionsService: PastSessionsService) {}

  ngOnInit() {
    console.log(this.pomData);
    // if (this.pomData && this.pomData.feedback) {
    this.updateFeedbackData();
    // this.pastSessionsService.filteredInUsers = [2];
    // }
  }

  updateFeedbackData() {
    const currentUserID = 2;
    let member: Pitchomaticgroupmember;
    // this.otherMembers = [];

    this.pomData.pom.pitchomaticgroupmembers.forEach(m => {
      if (m.user.id === currentUserID) {
        member = m;
      } else {
        // this.otherMembers.push(m);
      }
    });

    this.currentMember = member;
    console.log(this.currentMember);

    this.questions = [];
    this.fback = this.pomData.pom.feedbackquestion_set;

    this.fback.forEach((question: FeedbackQuestion) => {
      const assessments: Array<Assessment> = [];
      this.currentMember.pitchomaticfeedback_set.forEach(response => {
        if (response.feedbackquestion === question.id) {
          assessments.push({
            userId: response.user,
            rating: response.rating_answer,
            text: response.text_answer
          });
        }
      });

      this.questions.push({
        question_text: question.question_text,
        assessments: assessments,
        labels: [
          "Strongly Disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly Agree"
        ],
        is_combo: question.is_combo,
        combo_text: ""
      });
      console.log(this.questions);
    });
  }

  // ngOnInit() {
  //   this.getEvaluation();
  // }

  // getEvaluation() {
  //   console.log(this.pomData.pom);

  //   const currentUserID = 2;
  //   let member: Pitchomaticgroupmember;
  //   this.otherMembers = [];

  //   this.pomData.pom.pitchomaticgroupmembers.forEach(m => {
  //     if (m.user.id === currentUserID) {
  //       member = m;
  //     } else {
  //       this.otherMembers.push(m);
  //     }
  //   });

  //   this.currentMember = member;
  //   this.questions = this.pomData.pom.feedbackquestion_set;
  // }

  // getRating(member: Pitchomaticgroupmember, question: FeedbackQuestion) {
  //   // go into current member
  //   // in the list of pomfeedback_set make an inetersection of userid and feedbackquestion
  //   // return the rating_answer for that intersection
  //   // console.log(member, question);
  //   const fback = this.currentMember.pitchomaticfeedback_set.filter(
  //     q => q.user === member.user.id && q.feedbackquestion === question.id
  //   );
  //   if (fback.length) {
  //     return fback[0].rating_answer;
  //   } else {
  //     return '-';
  //   }
  // }
}
