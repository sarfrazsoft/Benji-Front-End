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
  questions: Array<{ id: number; question_text: string; answer: string }> = [];
  localStorageItemName = 'caseStudyNotes';
  showSharingUI = false;
  editorDisabled = false;
  worksheetTitle = '';

  // unique ID for the group
  groupId: string;
  // unique ID for document to be used in collaborative editor
  documentId: string;

  participantCode: string;
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

    if (this.actEditor) {
      this.editorDisabled = true;
      this.groupId = '1234';
      this.participantCode = '1234';
      this.documentId = new Date().getTime().toString();
      this.lessonRunCode = '33';
      this.jsonDoc = JSON.parse(this.act.default_data);
    } else {
      this.initEditor();
    }

    // this.saveInterval = setInterval(() => {
    //   if (this.getIsSharing()) {
    // this.saveEditCollab();
    //   }
    // }, 2000);
  }

  initEditor() {
    this.lessonRunCode = this.activityState.lesson_run.lessonrun_code.toString();
    this.worksheetTitle = this.activityState.casestudyactivity.activity_title;
    this.jsonDoc = null;
    this.activityId = this.activityState.casestudyactivity.activity_id;
    if (this.activityState.casestudyactivity.default_data) {
      // default data is set by the participant with the lowest participantCode
      // and also added to localstorage so that it's not added again
      const participantCode = this.getParticipantCode();
      const myGroup = this.getMyGroup(participantCode);
      const sortedParticipant = myGroup.participants.sort((a, b) => a - b);
      if (participantCode === sortedParticipant[0] && !myGroup.default_worksheet_applied) {
        this.jsonDoc = JSON.parse(this.activityState.casestudyactivity.default_data);
        this.sendMessage.emit(new CaseStudyDefaultWorksheetApplied(true));
      } else {
        this.jsonDoc = null;
      }
    }
    console.log(this.jsonDoc);
    this.groupId = null;
    setTimeout(() => {
      this.editorDisabled = false;
      this.participantCode = this.getParticipantCode().toString();

      const particiapntCode = this.getParticipantCode();
      const myGroup = this.getMyGroup(particiapntCode);
      const selectedGrouping = this.getMyGrouping();
      let moddedGroupId;
      if (myGroup && myGroup.id) {
        this.groupId = this.getMyGroup(particiapntCode).id.toString();
        if (selectedGrouping) {
          moddedGroupId = selectedGrouping + this.groupId;
        } else {
          moddedGroupId = this.groupId;
        }
        // create a unique ID by combining groupId and Lesson run code
      } else {
        // if participant is not part of any group
        this.groupId = 'x';
      }
      if (moddedGroupId) {
        this.documentId = moddedGroupId + this.lessonRunCode;
      } else {
        this.documentId = this.groupId + this.lessonRunCode;
      }
    }, 0);
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
    this.timer = this.act.activity_countdown_timer;

    // find out if your grouping just changed
    const particiapntCode = this.getParticipantCode();
    const myGroup = this.getMyGroup(particiapntCode);
    if (myGroup) {
      if (this.groupId !== myGroup.id.toString() && this.groupId !== undefined) {
        // group has changed
        this.initEditor();
      }
    }

    const state = this.activityState;
    if (state.running_tools && state.running_tools && state.running_tools.share) {
      const share = state.running_tools.share;
      if (share.selectedParticipant && share.selectedParticipant !== this.selectedParticipant) {
        this.selectedParticipant = share.selectedParticipant;
        this.saved = false;
      }

      if (share.selectedParticipant && share.selectedParticipant === particiapntCode && !this.saved) {
        this.saved = true;
        this.saveEditCollab();
      }
    }
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
