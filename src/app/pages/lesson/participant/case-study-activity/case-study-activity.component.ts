import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-case-study-activity',
  templateUrl: './case-study-activity.component.html',
  styleUrls: ['./case-study-activity.component.scss'],
})
export class ParticipantCaseStudyActivityComponent extends BaseActivityComponent
  implements OnInit {
  act;
  pitchDraftNotes = '';
  typingTimer;
  questions;
  constructor() {
    super();
  }

  ngOnInit() {
    this.act = this.activityState.casestudyactivity;
    this.questions = this.activityState.casestudyactivity.casestudyquestion_set;
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
      this.doneTyping(event.target.value, questionId);
    }, 3000);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping(answerText, questionId) {
    console.log(questionId, answerText);
    // CaseStudySaveFormEvent

    // const buildapitchsubmissionentry_set = [];
    // this.builtPitch_set.forEach(p => {
    //   if (p.value) {
    //     const buildAPitchSubmitEventEntry = new BuildAPitchSubmitEventEntry(
    //       p,
    //       p.value
    //     );
    //     buildapitchsubmissionentry_set.push(buildAPitchSubmitEventEntry);
    //   }
    // });

    // this.sendMessage.emit(
    //   new BuildAPitchSubmitPitchEvent(buildapitchsubmissionentry_set)
    // );
  }

  locallySaveDraft(event) {}
}
