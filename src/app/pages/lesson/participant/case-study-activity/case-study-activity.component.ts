import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ContextService } from 'src/app/services';
import {
  CaseStudyActivity,
  CaseStudyDefaultWorksheetApplied,
  CaseStudySubmitAnswerEvent,
  CaseStudyTeamDoneEvent,
  Group,
  Timer,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-case-study-activity',
  templateUrl: './case-study-activity.component.html',
})
export class ParticipantCaseStudyActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() actEditor = false;
  act: CaseStudyActivity;
  pitchDraftNotes = '';
  typingTimer;
  timer;
  jsonDoc;
  activityId;
  questions: Array<{ id: number; question_text: string; answer: string; default_editor_content: string }> =
    [];
  localStorageItemName = 'caseStudyNotes';
  showSharingUI = false;
  editorDisabled = false;
  worksheetTitle = '';

  // unique ID for the group
  groupId: string;
  // unique ID for document to be used in collaborative editor
  documentId: string;

  participantCode: number;
  lessonRunCode;

  component;
  saveInterval;
  selectedParticipant;
  saved;
  @ViewChild('activityEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  constructor(private cfr: ComponentFactoryResolver, private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.act = this.activityState.casestudyactivity;
    this.worksheetTitle = this.act.activity_title;
    this.participantCode = this.getParticipantCode();
    this.populateQuestions();
  }

  populateQuestions() {
    const questionsTemp = this.act.casestudyquestion_set;
    this.questions = [];
    questionsTemp.forEach((q, i) => {
      this.questions.push({ ...q, answer: '', default_editor_content: '' });
    });
  }

  ngOnChanges() {
    this.act = this.activityState.casestudyactivity;
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
      const groupParticipants = group.participants;
      if (groupParticipants.includes(userId)) {
        return groupParticipants;
      }
    }
  }

  getMyGroup(userId): Group {
    for (let i = 0; i < this.act.groups.length; i++) {
      const group = this.act.groups[i];
      const groupParticipants = group.participants;
      if (groupParticipants.includes(userId)) {
        return group;
      }
    }
  }

  getMyGrouping() {
    const state = this.activityState;
    if (
      state.running_tools &&
      state.running_tools.grouping_tool &&
      state.running_tools.grouping_tool.selectedGrouping
    ) {
      return state.running_tools.grouping_tool.selectedGrouping;
    }
  }

  // isUserNoteTaker() {
  //   const userId = this.getParticipantCode();
  //   for (let i = 0; i < this.act.casestudyparticipant_set.length; i++) {
  //     const user = this.act.casestudyparticipant_set[i];
  //     if (userId === user.participant.participant_code) {
  //       if (user.role === 'Note Taker') {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }
  //   }
  // }

  // getCaseStudyDetails() {
  //   const caseStudyDetails =
  //     '' +
  //     'This is a dummy content. You and your team will need to ' +
  //     'consider these details when you are working out your case study' +
  //     'consider these details when you are working out your case study' +
  //     'consider these details when you are working out your case study' +
  //     'consider these details when you are working out your case study' +
  //     'consider these details when you are working out your case study';
  //   return caseStudyDetails;
  // }

  // // on keyup, start the countdown
  // typingStoped(event, questionId) {
  //   localStorage.setItem('caseStudyNotes', JSON.stringify(this.questions));
  //   clearTimeout(this.typingTimer);
  //   this.typingTimer = setTimeout(() => {
  //     this.doneTyping();
  //   }, 3000);
  // }

  // // on keydown, clear the countdown
  // typingStarted() {
  //   clearTimeout(this.typingTimer);
  // }

  // doneTyping(submitCaseStudyDone?) {
  //   const casestudysubmissionentry_set = [];
  //   this.questions.forEach((q) => {
  //     const caseStudySubmitEventEntry = new CaseStudySubmitEventAnswer(q.id, q.answer);
  //     casestudysubmissionentry_set.push(caseStudySubmitEventEntry);
  //   });

  //   this.sendMessage.emit(new CaseStudySaveFormEvent(casestudysubmissionentry_set));
  //   localStorage.removeItem(this.localStorageItemName);
  //   if (submitCaseStudyDone) {
  //     submitCaseStudyDone();
  //   }
  // }

  submitCaseStudyDone() {
    // this.doneTyping(() => this.sendMessage.emit(new CaseStudyTeamDoneEvent()));
  }

  ngOnDestroy() {
    // this.saveEditCollab();
    // if (this.saveInterval) {
    //   clearInterval(this.saveInterval);
    // }
  }

  saveEditCollab() {
    // console.log(localStorage.getItem('collabedit'));
    const json = JSON.parse(localStorage.getItem('collabeditJSONDoc'));
    this.sendMessage.emit(new CaseStudySubmitAnswerEvent(json));
    // console.log(localStorage.getItem('collabeditJSONDoc'));
    // this.questions.forEach((q) => {
    //   console.log(q);
    //   const caseStudySubmitEventEntry = new CaseStudySubmitEventAnswer(q.id, q.answer);
    //   casestudysubmissionentry_set.push(caseStudySubmitEventEntry);
    // });
  }

  propagate($event) {
    this.sendMessage.emit($event);
  }

  locallySaveDraft(event) {}
}
// 15625
