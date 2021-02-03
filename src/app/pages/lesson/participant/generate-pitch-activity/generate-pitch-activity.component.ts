import { Component, ElementRef, OnChanges, OnInit } from '@angular/core';
import { ContextService, EmojiLookupService } from 'src/app/services';
import {
  FeedbackSubmitEventAnswer,
  PitchoMaticActivity,
  PitchoMaticBlank,
  PitchoMaticGroupMember,
  PitchoMaticParticipantGeneratedEvent,
  PitchoMaticParticipantInGroupEvent,
  PitchoMaticParticipantReadyEvent,
  PitchoMaticSubmitFeedbackEvent,
} from 'src/app/services/backend/schema';
// import * as odoo from 'src/assets/js/odoo.js';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-generate-pitch-activity',
  templateUrl: './generate-pitch-activity.component.html',
  styleUrls: ['./generate-pitch-activity.component.scss'],
})
export class ParticipantGeneratePitchActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  // variable to store current user
  currentMember;

  // variable to show split into groups section
  splitIntoGroups = false;
  // variable to store if the user has clicked I'm ready in group button
  userInGroup = false;

  // variable to show generate pitch screen
  generatePitchSection = false;
  generateButtonClicked = false;

  // variable to play animation only once
  pitchCriteriaRevealed = false;

  // variable to show draft your pitch screen
  draftPitchSection = false;
  // variable to store draft of the pitch
  pitchDraftNotes = '';
  // variable to store if pitch notes have to saved to backend
  pitchNotesSaved = false;

  // variable to show share your pitch
  sharePitchSection = false;
  // varible to show wait for your turn to share your pitch
  listenToPitchSection = false;

  // variable to show form to give feedback to others
  giveOthersFeedbackSection = false;
  // variable to show when current user is getting feedback from others
  gettingFeedbackSection = false;
  // variable to show when current user has submitted feedback
  thanksForFeedback = false;

  // variable to share what you liked about pitch
  shareFeedbackSection = false;

  pitch_set = [];

  constructor(
    private emoji: EmojiLookupService,
    private elementRef: ElementRef,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    const state = this.activityState;

    const currentUserID = this.getParticipantCode();

    let currentMember: PitchoMaticGroupMember;
    state.pitchomaticactivity.pitchomaticgroup_set.forEach((group) => {
      group.pitchomaticgroupmember_set.forEach((member) => {
        if (member.participant.participant_code === currentUserID) {
          currentMember = member;
        }
      });
    });

    this.currentMember = currentMember;

    if (state.pitchomaticactivity.activity_status === 'grouping') {
      this.splitIntoGroups = true;
      this.draftPitchSection = false;
      this.generatePitchSection = false;
    } else if (state.pitchomaticactivity.activity_status === 'preparing') {
      this.checkUserActivity();
      this.splitIntoGroups = false;
      this.getCurrentUserPitchSet();
      this.contextService.activityTimer = state.pitchomaticactivity.prepare_timer;
      if (!currentMember.has_generated) {
        this.generatePitchSection = true;
      } else if (currentMember.has_generated && !currentMember.has_prepared) {
        this.generatePitchSection = false;
        this.draftPitchSection = true;
      }
    } else if (state.pitchomaticactivity.activity_status === 'pitching') {
      this.thanksForFeedback = false;
      this.splitIntoGroups = false;
      this.gettingFeedbackSection = false;
      this.giveOthersFeedbackSection = false;
      this.shareFeedbackSection = false;
      if (!this.pitchNotesSaved && localStorage.getItem('pitchDraftNotes')) {
        this.savePitchNotes();
      } else {
        this.getUserPitchDraftNotes();
      }
      this.draftPitchSection = false;
      this.generatePitchSection = false;
      this.contextService.activityTimer = state.pitchomaticactivity.pitch_timer;
      if (this.isCurrentUserPitching()) {
        this.getCurrentUserPitchSet();
        this.sharePitchSection = true;
        this.listenToPitchSection = false;
      } else {
        this.sharePitchSection = false;
        this.listenToPitchSection = true;
      }
    } else if (state.pitchomaticactivity.activity_status === 'feedback') {
      this.listenToPitchSection = false;
      this.draftPitchSection = false;
      this.generatePitchSection = false;
      this.sharePitchSection = false;
      this.contextService.activityTimer = state.pitchomaticactivity.feedback_timer;
      if (this.isCurrentUserPitching()) {
        this.gettingFeedbackSection = true;
      } else {
        if (!this.thanksForFeedback) {
          this.giveOthersFeedbackSection = true;
        }
      }
    } else if (state.pitchomaticactivity.activity_status === 'discussion') {
      // localStorage.removeItem('pitchDraftNotes');
      this.listenToPitchSection = false;
      this.draftPitchSection = false;
      this.generatePitchSection = false;
      this.sharePitchSection = false;
      this.thanksForFeedback = false;
      this.giveOthersFeedbackSection = false;
      this.contextService.activityTimer = state.pitchomaticactivity.discuss_timer;
      if (this.isCurrentUserPitching()) {
        this.shareFeedbackSection = false;
        this.gettingFeedbackSection = true;
      } else {
        this.shareFeedbackSection = true;
      }
    }
  }

  getCurrentUserPitchSet() {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const blank_set: Array<PitchoMaticBlank> = act.pitchomaticblank_set;
    blank_set.sort((a, b) => a.order - b.order);
    // blank_set
    // 0:
    // id: 16
    // label: "The company you are pitching is:"
    // order: 0
    // pitchomaticblankchoice_set: Array(6)
    //    0: {id: 66, value: "Netflix"}
    //    1: {id: 67, value: "Google"}
    //    2: {id: 68, value: "Uber"}
    //    3: {id: 69, value: "Exxon"}
    //    4: {id: 70, value: "Apple"}
    //    5: {id: 71, value: "Ikea"}

    // 1:
    // id: 17
    // label: "You are pitching to:"
    // order: 1
    // pitchomaticblankchoice_set: Array(4)
    //    0: {id: 72, value: "dwarves"}
    //    1: {id: 73, value: "elves"}
    //    2: {id: 74, value: "orcs"}
    //    3: {id: 75, value: "your mom"}

    // 2:
    // id: 18
    // label: "And the technique you need to use is:"
    // order: 2
    // pitchomaticblankchoice_set: Array(3)
    //    0: {id: 76, value: "hypnosis"}
    //    1: {id: 77, value: "jedi mind-trick"}
    //    2: {id: 78, value: "analogy"}

    const currentUserID = this.getParticipantCode();
    let currentMember: PitchoMaticGroupMember;
    act.pitchomaticgroup_set.forEach((group) => {
      group.pitchomaticgroupmember_set.forEach((member) => {
        if (member.participant.participant_code === currentUserID) {
          currentMember = member;
        }
      });
    });

    // has_generated: false
    // has_prepared: false
    // is_grouped: false
    // is_pitching: false
    // pitch:
    //    pitchomaticgroupmemberpitchchoice_set: Array(3)
    //      0: {pitchomaticblank: 16, choice: 70}
    //      1: {pitchomaticblank: 17, choice: 73}
    //      2: {pitchomaticblank: 18, choice: 76}
    // pitch_done: false
    // pitch_prep_text: null
    // pitch_status: "waiting"
    // user: {id: 8, username: "61511", first_name: "61
    // 511", last_name: "", email: "", …}
    if (this.pitch_set.length === 0) {
      // [
      //   { id: 1, label: 'The company you are pitching is', value: 'IKEA' },
      //   { id: 2, label: 'You are pitching to:', value: 'a five year old child' },
      //   { id: 3, label: 'And the tec
      // hnique you need to use is:', value: 'analogy' }
      // ];

      blank_set.forEach((blank) => {
        const choice = currentMember.pitch.pitchomaticgroupmemberpitchchoice_set.filter((el) => {
          return el.pitchomaticblank === blank.id;
        })[0].choice;

        const value = blank.pitchomaticblankchoice_set.filter((el) => {
          return el.id === choice;
        })[0].value;

        this.pitch_set.push({
          id: blank.id,
          label: blank.label,
          order: blank.order,
          value: value,
        });
      });
    }
  }

  generatePitch() {
    this.generateButtonClicked = true;
    if (!this.pitchCriteriaRevealed) {
      // const ua = window.navigator.userAgent;
      // const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
      // const webkit = !!ua.match(/WebKit/i);
      // const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

      // this.pitch_set.forEach(blank => {
      // blank.value.split(' ').forEach((el, index) => {
      //   if (true) {
      //     const d1 = this.elementRef.nativeElement.querySelector(
      //       '.odoo_' + index + '_' + el
      //     );

      //     d1.innerText = el;
      //   } else {
      //     odoo.default({
      //       el: '.odoo_' + index + '_' + el,
      //       from: '',
      //       to: el,
      //       animationDelay: 0
      //     });
      //   }
      // });
      // });
      this.pitchCriteriaRevealed = true;

      setTimeout(() => {
        this.generatePitchSection = false;
        this.draftPitchSection = true;

        this.sendMessage.emit(new PitchoMaticParticipantGeneratedEvent());
      }, 10000);
    }
  }

  checkUserActivity() {
    // If user has no activity in 30 seconds
    // move to draft screen automatically

    setTimeout(() => {
      if (!this.pitchCriteriaRevealed) {
        this.pitchCriteriaRevealed = true;
        this.generatePitchSection = false;
        this.draftPitchSection = true;
        this.sendMessage.emit(new PitchoMaticParticipantGeneratedEvent());
      }
    }, 30000);
  }

  getUserPitchPrompt() {
    if (localStorage.getItem('pitchDraftNotes')) {
      this.pitchDraftNotes = localStorage.getItem('pitchDraftNotes');
    }
    let pitchText = '';
    const helpText = ['Pitch', 'to', 'using'];
    this.pitch_set.forEach((v, i) => {
      pitchText = pitchText + helpText[i] + ' <em class="primary-color">' + v.value + '</em> ';
    });
    return pitchText;
  }

  locallySaveDraft() {
    localStorage.setItem('pitchDraftNotes', this.pitchDraftNotes);
  }

  savePitchNotes() {
    this.sendMessage.emit(new PitchoMaticParticipantReadyEvent(this.pitchDraftNotes));
    this.pitchNotesSaved = true;
    localStorage.removeItem('pitchDraftNotes');
  }

  isCurrentUserPitching() {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const groupIndex = parseInt(this.getCurrentUserGroup(), 10) - 1;
    const pitchingMember = act.pitchomaticgroup_set[groupIndex].pitchomaticgroupmember_set.filter(
      (member) => member.is_pitching
    )[0];

    return pitchingMember.participant.participant_code === this.getParticipantCode();
  }

  submitAnswers(val) {
    if (this.thanksForFeedback) {
      return;
    }
    const answers: Array<FeedbackSubmitEventAnswer> = [];
    for (let i = 0; i < val.questions.length; i++) {
      if (val.questions[i].question_type === 'rating_agreedisagree') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
      if (val.questions[i].question_type === 'text') {
        const ans = new FeedbackSubmitEventAnswer(
          val.questions[i].q,
          val.questions[i].rating_answer,
          val.questions[i].text_answer
        );
        answers.push(ans);
      }
    }
    this.sendMessage.emit(new PitchoMaticSubmitFeedbackEvent(answers));
    this.giveOthersFeedbackSection = false;
    this.thanksForFeedback = true;
  }

  getCurrentUserGroup(): string {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const pitchingMember = act.pitchomaticgroup_set[0].pitchomaticgroupmember_set.filter(
      (member) => member.participant.participant_code === this.getParticipantCode()
    )[0];
    if (pitchingMember) {
      return '1';
    } else {
      return '2';
    }
  }

  userInGroupEvent() {
    if (!this.userInGroup) {
      this.sendMessage.emit(new PitchoMaticParticipantInGroupEvent());
      this.userInGroup = true;
    }
  }

  getGroupEmoji() {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const groupIndex = parseInt(this.getCurrentUserGroup(), 10) - 1;
    return act.pitchomaticgroup_set[groupIndex].group_emoji;
  }

  // Get pitching user of same group as current user
  getCurrentPitchingUser() {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;

    const groupIndex = parseInt(this.getCurrentUserGroup(), 10) - 1;
    const pitchingMember = act.pitchomaticgroup_set[groupIndex].pitchomaticgroupmember_set.filter(
      (member) => member.is_pitching
    )[0];
    const name = this.getParticipantName(pitchingMember.participant.participant_code);
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  getUserPitchDraftNotes() {
    const act: PitchoMaticActivity = this.activityState.pitchomaticactivity;
    const blank_set: Array<PitchoMaticBlank> = act.pitchomaticblank_set;
    blank_set.sort((a, b) => a.order - b.order);
    const currentUserID = this.getParticipantCode();
    let currentMember: PitchoMaticGroupMember;
    act.pitchomaticgroup_set.forEach((group) => {
      group.pitchomaticgroupmember_set.forEach((member) => {
        if (member.participant.participant_code === currentUserID) {
          currentMember = member;
        }
      });
    });
    this.pitchDraftNotes = currentMember.pitch_prep_text;
  }
}
