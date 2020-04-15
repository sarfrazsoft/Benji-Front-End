import { Component, OnChanges, OnInit } from '@angular/core';
import {
  CaseStudyActivity,
  CaseStudySaveFormEvent,
  CaseStudySubmitEventAnswer,
  CaseStudyTeamDoneEvent,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-case-study-activity',
  templateUrl: './case-study-activity.component.html',
  styleUrls: ['./case-study-activity.component.scss'],
})
export class ParticipantCaseStudyActivityComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: CaseStudyActivity;
  pitchDraftNotes = '';
  typingTimer;
  questions = [];
  constructor() {
    super();
  }

  ngOnInit() {
    this.act = this.activityState.casestudyactivity;
    const questionsTemp = this.activityState.casestudyactivity
      .casestudyquestion_set;
    questionsTemp.forEach((q, i) => {
      this.questions.push({ ...q, answer: '' });
    });

    // this.getUserRole();
  }

  ngOnChanges() {
    this.act = this.activityState.casestudyactivity;

    const myNoteTaker = this.getMyNoteTaker();
    console.log(myNoteTaker);

    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i].answer = myNoteTaker.casestudyanswer_set[i].answer;
    }
  }

  getMyNoteTaker() {
    const userId = this.activityState.your_identity.id;
    const myGroupFellows = this.getPeopleFromMyGroup();
    console.log(myGroupFellows);
    for (let i = 0; i < this.act.casestudyuser_set.length; i++) {
      const casestudyuser = this.act.casestudyuser_set[i];
      if (
        myGroupFellows.includes(casestudyuser.benjiuser_id) &&
        casestudyuser.role === 'Note Taker'
      ) {
        return casestudyuser;
      }
    }
  }

  getPeopleFromMyGroup() {
    const userId = this.activityState.your_identity.id;
    for (let i = 0; i < this.act.groups.length; i++) {
      const group = this.act.groups[i];
      for (let j = 0; j < group.usergroupuser_set.length; j++) {
        const user = group.usergroupuser_set[j].user;
        if (user.id === userId) {
          return group.usergroupuser_set.map((obj) => {
            return obj.user.id;
          });
        }
      }
    }
  }

  isUserNoteTaker() {
    const userId = this.activityState.your_identity.id;
    for (let i = 0; i < this.act.casestudyuser_set.length; i++) {
      const user = this.act.casestudyuser_set[i];
      if (userId === user.benjiuser_id) {
        if (user.role === 'Note Taker') {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  getCaseStudyDetails() {
    const caseStudyDetails =
      '' +
      'This is a dummy content. You and your team will need to ' +
      'consider these details when you are working out your case study' +
      'consider these details when you are working out your case study' +
      'consider these details when you are working out your case study' +
      'consider these details when you are working out your case study' +
      'consider these details when you are working out your case study';
    return caseStudyDetails;
  }

  // on keyup, start the countdown
  typingStoped(event, questionId) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping();
    }, 3000);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping() {
    const casestudysubmissionentry_set = [];
    this.questions.forEach((q) => {
      console.log(q.answer);
      const caseStudySubmitEventEntry = new CaseStudySubmitEventAnswer(
        q.id,
        q.answer
      );
      casestudysubmissionentry_set.push(caseStudySubmitEventEntry);
    });

    this.sendMessage.emit(
      new CaseStudySaveFormEvent(casestudysubmissionentry_set)
    );
  }

  submitCaseStudyDone() {
    this.sendMessage.emit(new CaseStudyTeamDoneEvent());
  }

  locallySaveDraft(event) {}
}
