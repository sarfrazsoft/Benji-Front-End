import { Component, Input, OnInit } from '@angular/core';
import {
  ActivityReport,
  FeedbackQuestion,
  Pitchomaticgroupmember
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-pitch-evaluation',
  templateUrl: './pitch-evaluation.component.html',
  styleUrls: ['./pitch-evaluation.component.scss']
})
export class PitchEvaluationComponent implements OnInit {
  @Input() pomData: ActivityReport;
  name = '';
  otherMembers = [];
  currentMember: Pitchomaticgroupmember;
  questions: Array<FeedbackQuestion> = [];
  constructor() {}

  ngOnInit() {
    this.getEvaluation();
  }

  getEvaluation() {
    console.log(this.pomData.pom);

    const currentUserID = 2;
    let member: Pitchomaticgroupmember;
    this.otherMembers = [];

    this.pomData.pom.pitchomaticgroupmembers.forEach(m => {
      if (m.user.id === currentUserID) {
        member = m;
      } else {
        this.otherMembers.push(m);
      }
    });

    this.currentMember = member;
    this.questions = this.pomData.pom.feedbackquestion_set;
  }

  getRating(member: Pitchomaticgroupmember, question: FeedbackQuestion) {
    // go into current member
    // in the list of pomfeedback_set make an inetersection of userid and feedbackquestion
    // return the rating_answer for that intersection
    // console.log(member, question);
    const fback = this.currentMember.pitchomaticfeedback_set.filter(
      q => q.user === member.user.id && q.feedbackquestion === question.id
    );
    if (fback.length) {
      return fback[0].rating_answer;
    } else {
      return '-';
    }
  }
}
