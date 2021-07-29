import { useAnimation } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { reverse } from 'lodash';
import { BuildAPitchService, ContextService, EmojiLookupService } from 'src/app/services';
import {
  BuildAPitchActivity,
  BuildAPitchSubmitEventEntry,
  BuildAPitchSubmitPitchEvent,
  BuildAPitchSubmitVoteEvent,
  Timer,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-build-pitch-activity',
  templateUrl: './build-pitch-activity.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ParticipantBuildPitchActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  builtPitch_set;
  builtPitch_setNew;
  act: BuildAPitchActivity;
  createPitch = false;
  pitchSubmitted = false;
  blankPitch = false;
  pitchValid = false;
  showMyPitch = false;
  voteNow = false;
  thanksForVote = false;
  userVoted = false;
  lookAtWinningPitch = false;
  yourPitchWon = false;
  expandedUserArray = {};
  myParticipantCode;

  selectedUser: number = null;

  blanksArray = [];

  @ViewChild('ref') ref: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private contextService: ContextService,
    private buildAPitchService: BuildAPitchService
  ) {
    super();
    this.builtPitch_set = [];
  }

  ngOnInit() {
    super.ngOnInit();

    // this.getBlanks(
    //   '{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"my name is "},{"type":"text","marks":[{"type":"u"}],"text":"baghi."},{"type":"text","text":" I can’t believe it’s not "},{"type":"text","marks":[{"type":"u"}],"text":"insert food here."},{"type":"text","text":" cheers."}]},{"type":"paragraph","attrs":{"align":null}},{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"my name is "},{"type":"text","marks":[{"type":"u"}],"text":"baghi."},{"type":"text","text":" I can’t believe it’s not "},{"type":"text","marks":[{"type":"u"}],"text":"insert food here."},{"type":"text","text":" cheers."}]}]}'
    // );

    this.myParticipantCode = this.getParticipantCode();
    // how about we make the list of objects that
    // we are submitting to BE and each node can have an NgModel
    this.builtPitch_set = [];
    this.builtPitch_setNew = [];

    this.act = this.activityState.buildapitchactivity;
    this.blanksArray = this.buildAPitchService.getBlanks(this.act.blanks_string);
    this.builtPitch_setNew = this.blanksArray;

    if (this.act.buildapitchblank_set) {
      this.act.buildapitchblank_set
        .filter((el) => el != null)
        .sort((a, b) => a.order - b.order)
        .forEach((v) => {
          this.builtPitch_set.push({ ...v, ...{ value: null } });
        });

      // console.log(this.builtPitch_set);

      // this.builtPitch_set.forEach((element) => {
      //   this.builtPitch_setNew.push({ type: 'label', ...element });
      //   this.builtPitch_setNew.push({ type: 'blank', ...element });
      // });

      // console.log(this.builtPitch_setNew);
    }

    if (this.act.build_countdown_timer.editor) {
      this.createPitch = true;
    }

    if (
      this.act.sharing_done &&
      !this.act.voting_done &&
      !this.thanksForVote &&
      (this.act.vote_countdown_timer.status === 'running' ||
        this.act.vote_countdown_timer.status === 'paused')
    ) {
      if (
        Object.entries(this.expandedUserArray).length === 0 &&
        this.expandedUserArray.constructor === Object
      ) {
        this.fillExpandedUserArray();
      }
      this.createPitch = false;
      this.showMyPitch = false;
      this.voteNow = true;
    }
  }

  // getBlanks(blanksString: string) {
  //   const json = JSON.parse(blanksString);
  //   this.blanksArray = [];
  //   this.populateBlanksArray(json);
  //   this.builtPitch_setNew = this.blanksArray;
  //   return this.blanksArray;
  // }

  // populateBlanksArray(json) {
  //   if (json.content) {
  //     for (let i = 0; i < json.content.length; i++) {
  //       this.populateBlanksArray(json.content[i]);
  //     }
  //   } else if (json.type === 'text') {
  //     if (json.marks) {
  //       let isUnderline = false;
  //       for (let i = 0; i < json.marks.length; i++) {
  //         if (json.marks[i].type === 'u') {
  //           isUnderline = true;
  //           this.blanksArray.push({ type: 'blank', temp_text: json.text });
  //         }
  //       }
  //       if (isUnderline) {
  //       } else {
  //         this.blanksArray.push({ type: 'label', label: json.text });
  //       }
  //     } else {
  //       this.blanksArray.push({ type: 'label', label: json.text });
  //     }
  //     return;
  //   }
  // }

  ngOnChanges() {
    this.act = this.activityState.buildapitchactivity;
    this.act.buildapitchblank_set = this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    this.setTimer(this.act);
    if (
      (this.act.build_countdown_timer.status === 'running' ||
        this.act.build_countdown_timer.status === 'paused') &&
      this.act.buildapitchpitch_set.filter(
        (e) => e.participant.participant_code === this.getParticipantCode()
      ).length === 0
    ) {
      this.createPitch = true;
    } else if (
      (this.act.buildapitchpitch_set.filter(
        (e) => e.participant.participant_code === this.getParticipantCode()
      ).length > 0 ||
        this.act.build_countdown_timer.status === 'ended' ||
        this.act.build_countdown_timer.status === 'cancelled') &&
      !this.showMyPitch &&
      !this.voteNow &&
      !this.act.winning_participant &&
      !this.act.voting_done &&
      !this.thanksForVote &&
      !(this.act.vote_countdown_timer && this.act.vote_countdown_timer.status === 'running')
    ) {
      if (!this.pitchSubmitted) {
        this.pitchValid = true;
        if (
          this.act.buildapitchpitch_set.filter(
            (e) => e.participant.participant_code === this.getParticipantCode()
          ).length === 0
        ) {
          this.submitPitch();
        }
      }
      this.createPitch = false;
      this.showMyPitch = true;
      this.voteNow = false;
    } else if (
      this.act.sharing_done &&
      !this.act.voting_done &&
      !this.thanksForVote &&
      this.act.vote_countdown_timer.status === 'running'
    ) {
      if (
        Object.entries(this.expandedUserArray).length === 0 &&
        this.expandedUserArray.constructor === Object
      ) {
        this.fillExpandedUserArray();
      }
      this.createPitch = false;
      this.showMyPitch = false;
      this.voteNow = true;
    } else if (this.act.voting_done && this.act.winning_participant) {
      this.showMyPitch = false;
      this.voteNow = false;
      this.thanksForVote = false;
      if (this.act.winning_participant.participant_code === this.getParticipantCode()) {
        this.yourPitchWon = true;
      } else {
        this.lookAtWinningPitch = true;
      }
    }
  }

  setTimer(act: BuildAPitchActivity) {
    if (!act.building_done && !act.sharing_done && !act.voting_done) {
      this.contextService.activityTimer = act.build_countdown_timer;
    } else if (act.building_done && !act.sharing_done) {
      this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    } else if (act.sharing_done && !act.voting_done) {
      this.contextService.activityTimer = act.vote_countdown_timer;
    } else if (act.sharing_done && act.voting_done && act.winning_participant) {
      const timer = this.getNextActStartTimer();
      this.contextService.activityTimer = timer;
    }
  }

  fillExpandedUserArray() {
    // this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    this.activityState.buildapitchactivity.buildapitchpitch_set.forEach((v) => {
      this.expandedUserArray['' + v.participant.participant_code] = false;
    });
  }

  updateBlankValue(blank, event) {
    blank.value = event.srcElement.innerText;
    this.checkValidity();
  }

  // checkValidityOld() {
  //   this.pitchValid = true;
  //   for (let i = 0; i < this.builtPitch_set.length; i++) {
  //     const element = this.builtPitch_set[i];
  //     if (this.builtPitch_set[i].value === null || this.builtPitch_set[i].value === '') {
  //       this.pitchValid = false;
  //     }
  //   }
  // }

  checkValidity() {
    this.pitchValid = true;
    for (let i = 0; i < this.builtPitch_setNew.length; i++) {
      const element = this.builtPitch_setNew[i];
      if (element.type === 'blank') {
        if (element.value === null || element.value === '') {
          this.pitchValid = false;
        }
      }
    }
  }

  submitPitch() {
    if (!this.pitchValid) {
      return;
    }
    const buildapitchsubmissionentry_set = [];
    this.builtPitch_setNew.forEach((p, i) => {
      if (p.type === 'blank') {
        if (p.value) {
          const buildAPitchSubmitEventEntry = new BuildAPitchSubmitEventEntry(p.value, i);
          buildapitchsubmissionentry_set.push(buildAPitchSubmitEventEntry);
        } else {
          const buildAPitchSubmitEventEntry = new BuildAPitchSubmitEventEntry(p.temp_text, i);
          buildapitchsubmissionentry_set.push(buildAPitchSubmitEventEntry);
        }
      }
    });
    // reverse(buildapitchsubmissionentry_set);
    this.sendMessage.emit(new BuildAPitchSubmitPitchEvent(buildapitchsubmissionentry_set));
    this.pitchSubmitted = true;
  }

  userSelected($event) {
    this.selectedUser = $event;
  }

  userExpanded($event) {
    this.expandedUserArray['' + $event] = true;
  }

  userCollapsed($event) {
    this.expandedUserArray['' + $event] = false;
  }

  yourPitchText() {
    return this.getPitchText(this.getParticipantCode(), this.act);
  }

  userPitchExists(userId) {
    // console.log(this.getParticipantCode());
    // console.log(userId);
    // // this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    // console.log(this.activityState.buildapitchactivity.buildapitchpitch_set);
    return this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
      (e) => e.participant.participant_code === userId
    ).length;
  }

  getPitchText(userId, act) {
    const parsedBlanks = this.buildAPitchService.getBlanks(this.act.blanks_string);
    const filteredParsedBlanks = parsedBlanks.filter((e) => e.type === 'label');

    act.buildapitchblank_set.sort((a, b) => a.order - b.order);

    const buildAPitchPitchSet = act.buildapitchpitch_set.filter(
      (e) => e.participant.participant_code === userId
    );

    let statement = '';
    let buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
    // buildAPitchEntrySet.forEach((element, i) => {
    //   element['order'] = i;
    // });
    // console.log(buildAPitchEntrySet);
    buildAPitchEntrySet = buildAPitchEntrySet.sort((a, b) => a.order - b.order);
    filteredParsedBlanks.forEach((b, i) => {
      const currentBlanksValue = buildAPitchEntrySet[i];
      let value = '';
      if (currentBlanksValue) {
        value = ' <em>' + currentBlanksValue.value + '</em> ';
      } else {
        // value = ' <em class="warning-color">(' + b.label + ')</em> ';
        // this.blankPitch = true;
      }
      statement = statement + b.label + value;
    });
    return statement;
  }

  isPitchBlank(userId) {
    // this.act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    // const blanks = this.activityState.buildapitchactivity.buildapitchblank_set;
    // const buildAPitchPitchSet = this.activityState.buildapitchactivity.buildapitchpitch_set.filter(
    //   (e) => e.participant.participant_code === userId
    // );

    // // let statement = '';
    // let blankPitch = false;
    // const buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
    // blanks.forEach((b, i) => {
    //   const currentBlanksValue = buildAPitchEntrySet.filter((v) => v.buildapitchblank === b.id);

    //   if (currentBlanksValue.length === 0) {
    //     blankPitch = true;
    //   }
    // });
    // return blankPitch;
    return false;
  }

  getUserName(userId) {
    return this.getParticipantName(userId);
  }

  submitVote(user) {
    if (!this.userVoted) {
      this.sendMessage.emit(new BuildAPitchSubmitVoteEvent(user));
      this.voteNow = false;
      this.showMyPitch = false;
      this.userVoted = true;
      this.thanksForVote = true;
    }
  }

  focusFunction(blank) {
    if (blank.focused) {
    } else {
      blank.focused = true;
      // blank.temp_text = '';
    }
  }
}
export const c = {
  creation_time: '2021-03-18T09:17:54.137941-04:00',
  effective_permission: null,
  id: 1,
  is_shared: false,
  is_valid_lesson: true,
  last_edited: '2021-03-18T09:18:12.725983-04:00',
  lesson_description: 'untitled lesson description',
  lesson_id: null,
  lesson_length_minutes: null,
  lesson_name: 'test lesson',
  owner: 3,
  public_permission: null,
  single_user_lesson: false,
  standardize: true,
  team: null,
  team_permission: null,
  activities: [
    {
      activity_id: '1616073475159',
      activity_type: 'TitleActivity',
      auto_next: true,
      description: null,
      end_time: null,
      facilitation_status: 'running',
      hide_timer: true,
      id: 1,
      is_paused: false,
      main_title: 'abc',
      next_activity: null,
      next_activity_delay_seconds: 10000,
      next_activity_start_timer: { id: 1, status: 'running', start_time: '2021-03-18T09:19:20.970201-04:00' },
      polymorphic_ctype: 56,
      run_number: 0,
      start_time: '2021-03-18T09:19:20.964651-04:00',
      title_image: 'emoji://1F642',
      title_text: null,
    },
    {
      activity_id: '1616073475159',
      activity_type: 'TitleActivity',
      auto_next: true,
      description: null,
      end_time: null,
      facilitation_status: 'running',
      hide_timer: true,
      id: 1,
      is_paused: false,
      main_title: 'abc',
      next_activity: null,
      next_activity_delay_seconds: 10000,
      next_activity_start_timer: { id: 1, status: 'running', start_time: '2021-03-18T09:19:20.970201-04:00' },
      polymorphic_ctype: 56,
      run_number: 0,
      start_time: '2021-03-18T09:19:20.964651-04:00',
      title_image: 'emoji://1F642',
      title_text: null,
    },
    {
      activity_id: '1616074069246',
      activity_type: 'BuildAPitchActivity',
      auto_next: true,
      build_countdown_timer: { id: 3, status: 'running' },
      build_seconds: 120,
      buildapitchblank_set: [{ id: 1, order: 1, label: 'labe', temp_text: 'f', help_text: null }],
      buildapitchpitch_set: [],
      building_done: false,
      description: null,
      end_time: null,
      facilitation_status: 'running',
      hide_timer: true,
      id: 4,
      instructions: 'rr',
      is_paused: false,
      next_activity: null,
      next_activity_delay_seconds: 0,
      next_activity_start_timer: null,
      polymorphic_ctype: 152,
      run_number: 0,
      share_start_participant: null,
      sharing_done: false,
      start_time: '2021-03-18T09:28:51.199879-04:00',
      title: 'er',
      vote_countdown_timer: null,
      vote_seconds: 0,
      votes: [],
      voting_done: false,
      winning_participant: null,
    },
  ],
};
