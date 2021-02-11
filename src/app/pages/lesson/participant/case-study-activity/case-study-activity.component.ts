import { Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContextService } from 'src/app/services';
import {
  CaseStudyActivity,
  CaseStudySaveFormEvent,
  CaseStudySubmitEventAnswer,
  CaseStudyTeamDoneEvent,
  Timer,
} from 'src/app/services/backend/schema';
import { TextEditorComponent } from 'src/app/shared/components/text-editor/text-editor.component';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-case-study-activity',
  templateUrl: './case-study-activity.component.html',
  styleUrls: ['./case-study-activity.component.scss'],
})
export class ParticipantCaseStudyActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: CaseStudyActivity;
  pitchDraftNotes = '';
  typingTimer;
  timer;
  questions: Array<{ id: number; question_text: string; answer: string }> = [];
  isDone = false;
  localStorageItemName = 'caseStudyNotes';

  groupId;

  participant_code;
  lessonrun_code;

  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.casestudyactivity;
    this.participant_code = this.getParticipantCode();
    this.lessonrun_code = this.activityState.lesson_run.lessonrun_code.toString();
    // this.populateQuestions();

    const userId = this.getParticipantCode();
    this.groupId = this.getMyGroup(userId).id;
  }

  populateQuestions() {
    const questionsTemp = this.act.casestudyquestion_set;
    this.questions = [];
    questionsTemp.forEach((q, i) => {
      this.questions.push({ ...q, answer: '' });
    });
  }

  ngOnChanges() {
    this.act = this.activityState.casestudyactivity;
    this.contextService.activityTimer = this.act.activity_countdown_timer;
    this.timer = this.act.activity_countdown_timer;
    console.log(this.timer);
    // this.populateQuestions();
    const myNoteTaker = this.getMyNoteTaker();

    // if (myNoteTaker) {
    this.isDone = myNoteTaker.is_done;

    if (!myNoteTaker.is_done) {
      this.contextService.activityTimer = this.act.activity_countdown_timer;
    } else {
      this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    }

    // Populate the answers if available
    // if (localStorage.getItem(this.localStorageItemName)) {
    //   this.questions = JSON.parse(localStorage.getItem(this.localStorageItemName));
    // } else {
    //   for (let i = 0; i < this.questions.length; i++) {
    //     const questionID = this.questions[i].id;
    //     for (let j = 0; j < myNoteTaker.casestudyanswer_set.length; j++) {
    //       const noteTakersAns = myNoteTaker.casestudyanswer_set[j];
    //       if (noteTakersAns.casestudyquestion === questionID) {
    //         this.questions[i].answer = noteTakersAns.answer;
    //       }
    //     }
    //   }
    //   // }
    // }
  }

  getMyNoteTaker() {
    const userId = this.getParticipantCode();
    const myGroupFellows = this.getPeopleFromMyGroup(userId);
    for (let i = 0; i < this.act.casestudyparticipant_set.length; i++) {
      const casestudyuser = this.act.casestudyparticipant_set[i];
      if (
        myGroupFellows.includes(casestudyuser.participant.participant_code) &&
        casestudyuser.role === 'Note Taker'
      ) {
        return casestudyuser;
      }
    }
  }

  getPeopleFromMyGroup(userId) {
    for (let i = 0; i < this.act.groups.length; i++) {
      const group = this.act.groups[i];
      const groupParticipants = group.participantgroupstatus_set.map((obj) => {
        return obj.participant.participant_code;
      });
      if (groupParticipants.includes(userId)) {
        return groupParticipants;
      }
    }
  }

  getMyGroup(userId) {
    for (let i = 0; i < this.act.groups.length; i++) {
      const group = this.act.groups[i];
      const groupParticipants = group.participantgroupstatus_set.map((obj) => {
        return obj.participant.participant_code;
      });
      if (groupParticipants.includes(userId)) {
        return group;
      }
    }
  }

  isUserNoteTaker() {
    const userId = this.getParticipantCode();
    for (let i = 0; i < this.act.casestudyparticipant_set.length; i++) {
      const user = this.act.casestudyparticipant_set[i];
      if (userId === user.participant.participant_code) {
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
    localStorage.setItem('caseStudyNotes', JSON.stringify(this.questions));
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping();
    }, 3000);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping(submitCaseStudyDone?) {
    const casestudysubmissionentry_set = [];
    this.questions.forEach((q) => {
      const caseStudySubmitEventEntry = new CaseStudySubmitEventAnswer(q.id, q.answer);
      casestudysubmissionentry_set.push(caseStudySubmitEventEntry);
    });

    this.sendMessage.emit(new CaseStudySaveFormEvent(casestudysubmissionentry_set));
    localStorage.removeItem(this.localStorageItemName);
    if (submitCaseStudyDone) {
      submitCaseStudyDone();
    }
  }

  submitCaseStudyDone() {
    this.doneTyping(() => this.sendMessage.emit(new CaseStudyTeamDoneEvent()));
  }

  locallySaveDraft(event) {}
}
