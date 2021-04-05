import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { clone } from 'lodash';
import { ActivityTypes, AllowShareActivities } from 'src/app/globals';
import { ContextService, PastSessionsService, SharingToolService } from 'src/app/services';
import { Timer, User } from 'src/app/services/backend/schema';
import { Lesson, Participant } from 'src/app/services/backend/schema/course_details';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.dialog';
import { PeakBackDialogComponent } from '../../pages/lesson/shared/dialogs/';
import {
  BeginShareEvent,
  BootParticipantEvent,
  BrainstormSubmissionCompleteInternalEvent,
  BrainstormToggleCategoryModeEvent,
  BrainstormVotingCompleteInternalEvent,
  EndEvent,
  FastForwardEvent,
  NextInternalEvent,
  PauseActivityEvent,
  PreviousEvent,
  ResetEvent,
  ResumeActivityEvent,
  ServerMessage,
  UpdateMessage,
} from '../../services/backend/schema/messages';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'benji-main-screen-footer',
  templateUrl: './main-screen-footer.component.html',
})
export class MainScreenFooterComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() showFastForward: boolean;
  @Input() isLastActivity: boolean;
  @Input() showFooter: boolean;
  @Input() lessonName: string;
  @Input() roomCode: string;
  @Input() isPaused: boolean;
  @Input() disableControls: boolean;

  timer: Timer;
  showTimer = false;

  participants: Array<Participant> = [];
  pastActivities: Array<any> = [];
  noActivitiesToShow = false;
  dialogRef;
  at: typeof ActivityTypes = ActivityTypes;
  actType = '';
  lesson: Lesson;
  fastForwarding = false;

  allowShareActivities = AllowShareActivities;

  constructor(
    private videoStateService: VideoStateService,
    private dialog: MatDialog,
    private pastSessionsService: PastSessionsService,
    public contextService: ContextService,
    private router: Router,
    private sharingToolService: SharingToolService
  ) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {
    if (this.activityState && this.activityState.lesson) {
      this.lesson = this.activityState.lesson;
    }
  }

  ngOnChanges() {
    // if (this.actType !== this.activityState.activity_type) {
    this.fastForwarding = false;
    // }
    // this.actType = this.activityState.activity_type;

    if (this.activityState) {
      this.participants = this.activityState.lesson_run.participant_set;
    }

    const as = this.activityState;
    if (as) {
      if (as.activity_type === this.at.brainStorm || as.activity_type === this.at.title) {
        if (as.activity_type === this.at.title) {
          if (as.titleactivity.hide_timer) {
            this.showTimer = false;
          } else {
            this.initializeTimer();
          }
        } else if (as.activity_type === this.at.brainStorm) {
          if (as.brainstormactivity.hide_timer) {
            this.showTimer = false;
          } else {
            this.initializeTimer();
          }
        }
      } else {
        this.showTimer = false;
      }
    }
  }

  initializeTimer() {
    this.showTimer = true;
    this.contextService.activityTimer$.subscribe((timer: Timer) => {
      if (timer) {
        this.timer = timer;
      }
    });
  }

  controlClicked(eventType) {
    // if (this.videoStateService.videoState) {
    // this.videoStateService.videoState = eventType;
    if (this.disableControls) {
      return false;
    }
    if (eventType === 'pause') {
      this.socketMessage.emit(new PauseActivityEvent());
    } else if (eventType === 'next') {
      // this.socketMessage.emit(new EndEvent());
      // Remove pitch notes if that activity was
      // fowarded without completion
      // The concerned activity should be told that it has been
      // skipped over so the activity can close properly
      // if (localStorage.getItem('pitchDraftNotes')) {
      //   localStorage.removeItem('pitchDraftNotes');
      // }
      this.socketMessage.emit(new NextInternalEvent());
    } else if (eventType === 'resume') {
      this.socketMessage.emit(new ResumeActivityEvent());
    } else if (eventType === 'fastForward') {
      if (this.activityState.activity_type === this.at.brainStorm) {
        const act = this.activityState.brainstormactivity;
        if (!act.submission_complete) {
          this.socketMessage.emit(new BrainstormSubmissionCompleteInternalEvent());
        } else if (!act.voting_complete) {
          this.socketMessage.emit(new BrainstormVotingCompleteInternalEvent());
        } else {
          this.socketMessage.emit(new FastForwardEvent());
        }
      } else {
        this.socketMessage.emit(new FastForwardEvent());
      }
      this.fastForwarding = true;
    } else if (eventType === 'previous') {
      this.socketMessage.emit(new PreviousEvent());
    } else if (eventType === 'reset') {
      this.socketMessage.emit(new ResetEvent());
    }
    // }
  }

  brainstormSubmissionComplete() {
    this.socketMessage.emit(new BrainstormSubmissionCompleteInternalEvent());
  }

  toggleCategorization() {
    this.socketMessage.emit(new BrainstormToggleCategoryModeEvent());
  }

  startShareEvent() {}

  redoAct(act) {
    const state = clone(this.activityState);
    if (act.activity_type === this.at.mcq) {
      state.activity_type = this.at.mcq;
      state.mcqactivity = act;
    } else if (act.activity_type === this.at.brainStorm) {
      state.activity_type = 'BrainstormActivity';
      state.brainstormactivity = act;
    }
    this.dialogRef = this.dialog
      .open(PeakBackDialogComponent, {
        data: { serverMessage: state },
        disableClose: false,
        panelClass: 'peak-back-dialog',
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  getActivities() {
    const code = this.activityState.lesson_run.lessonrun_code;
    this.pastActivities = [];
    this.noActivitiesToShow = false;
    this.pastSessionsService.getLessonsActivities(code).subscribe((res: any) => {
      res = res.filter((x) => x.facilitation_status === 'ended');
      res = res.filter(
        (x) => x.activity_type === this.at.brainStorm
        // x.activity_type === this.at.mcq ||
        // x.activity_type === this.at.mcqResults
      );
      this.pastActivities = res;
      if (this.pastActivities.length === 0) {
        this.noActivitiesToShow = true;
      }
    });
    // /api/course_details/lesson_run/{lessonrun_code}/activities/
  }

  endSession() {
    if (this.activityState && this.activityState.lesson_run) {
      const host = this.activityState.lesson_run.host;
      const benjiUser = JSON.parse(localStorage.getItem('benji_user'));
      if (host.id === benjiUser.id) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/participant/join']);
      }
    }
  }

  startSharingTool() {
    this.socketMessage.emit(new BeginShareEvent());
    this.sharingToolService.sharingToolControl$.next(this.activityState);
  }

  deleteUser(p: Participant) {
    const msg = 'Are you sure you want to delete ' + p.display_name + '?';
    this.dialogRef = this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: msg,
        },
        disableClose: true,
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.socketMessage.emit(new BootParticipantEvent(p.participant_code));
        }
      });
  }

  getActiveParticipants() {
    return this.activityState.lesson_run.participant_set.filter((x) => x.is_active);
  }

  isSharingAllowed(activityState: UpdateMessage) {
    if (activityState && this.allowShareActivities.includes(activityState.activity_type)) {
      return true;
    } else {
      return false;
    }
  }
}

export const acts = [
  {
    id: 7453,
    next_activity_start_timer: null,
    facilitation_status: 'ended',
    activity_id: 'main_lobby',
    description: 'Waiting for participants to join',
    start_time: '2020-06-13T19:30:00.191107-04:00',
    end_time: '2020-06-13T19:34:18.732600-04:00',
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    lobby_text: null,
    polymorphic_ctype: 38,
    next_activity: 7435,
    activity_type: 'LobbyActivity',
  },
  {
    id: 7435,
    next_activity_start_timer: {
      id: 2690,
      status: 'running',
      start_time: '2020-06-13T19:34:18.741477-04:00',
      end_time: '2020-06-13T19:36:18.741477-04:00',
      total_seconds: 120.0,
      remaining_seconds: 114.515193,
    },
    facilitation_status: 'running',
    feedbackquestion_set: [
      {
        id: 3045,
        question_type: 'rating_agreedisagree',
        question_text: 'I know how to apply behaviour science principles to my work.',
        is_combo: true,
        combo_text: 'Why did you provide your answer above?',
      },
      {
        id: 3044,
        question_type: 'rating_agreedisagree',
        question_text: 'I understand and can articulate the INSURE ME model.',
        is_combo: true,
        combo_text: 'Why did you provide your answer above?',
      },
    ],
    answered_participants: [],
    titlecomponent: {
      title_image: 'emoji://memo',
      title: 'Pre-assessment.',
      screen_instructions: 'Let’s check-in on your understanding of the INSURE ME model before we begin.',
      participant_instructions:
        'Let’s check-in on your understanding of the INSURE ME model before we begin.',
    },
    activity_id: 'benji_feedback',
    description: 'Pre Assessment',
    start_time: '2020-06-13T19:34:18.737752-04:00',
    end_time: null,
    next_activity_delay_seconds: 120,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    polymorphic_ctype: 51,
    next_activity: 7436,
    activity_type: 'FeedbackActivity',
  },
  {
    id: 7451,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    initial_choice_timer: null,
    reveal_timer: null,
    change_choice_timer: null,
    results_timer: null,
    current_round: 1,
    current_round_details: [],
    results: [],
    activity_id: 'sample_montyhall',
    description: 'hello world',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    initial_choice_seconds: 45,
    change_choice_seconds: 45,
    reveal_seconds: 45,
    results_seconds: 120,
    status: 'not_started',
    polymorphic_ctype: 161,
    next_activity: null,
    activity_type: 'MontyHallActivity',
  },
  {
    id: 7450,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    discussion_countdown_timer: null,
    discussiongroup_set: [],
    currently_sharing_group: null,
    next_sharing_group: null,
    activity_id: 'discussion_3',
    description: 'Discuss the case study',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    title: 'Discuss the case study',
    instructions: 'Discuss the case study',
    participant_instructions: null,
    num_sharers: 3,
    discussion_seconds: 0,
    sharing_seconds: 180,
    discussion_complete: false,
    polymorphic_ctype: 91,
    next_activity: null,
    group_from_activity: null,
    grouping_activity: 7444,
    notes_activity: 7448,
    activity_type: 'DiscussionActivity',
  },
  {
    id: 7449,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    activity_id: 'gather_2',
    description: 'desc',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    gather_text: 'Waiting for everyone to rejoin the group',
    polymorphic_ctype: 151,
    next_activity: null,
    activity_type: 'GatherActivity',
  },
  {
    id: 7448,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    activity_countdown_timer: null,
    casestudyuser_set: [],
    casestudyquestion_set: [
      {
        id: 231,
        question_text: 'Consider the channels',
      },
    ],
    groups: [],
    activity_id: 'case_study_act_1',
    description: 'A case study activity',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 1,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    activity_seconds: 200,
    note_taker_instructions: 'Fill out the form below and press the submit button',
    participant_instructions: 'Work with the note-taker to complete your form',
    activity_title: 'Case Study',
    mainscreen_instructions: 'Work with your group to fill out the worksheet. Click submit when done.',
    case_study_details:
      'After reviewing the application form, discuss with your group and have the note-take jot down your ideas in the below forms.',
    polymorphic_ctype: 153,
    next_activity: null,
    grouping_activity: 7444,
    activity_type: 'CaseStudyActivity',
  },
  {
    id: 7447,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    discussion_countdown_timer: null,
    discussiongroup_set: [],
    currently_sharing_group: null,
    next_sharing_group: null,
    activity_id: 'discussion_2',
    description: 'Discuss the case study',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    title: 'Discuss the case study',
    instructions: 'Discuss the case study',
    participant_instructions: null,
    num_sharers: 3,
    discussion_seconds: 0,
    sharing_seconds: 180,
    discussion_complete: false,
    polymorphic_ctype: 91,
    next_activity: null,
    group_from_activity: null,
    grouping_activity: 7444,
    notes_activity: 7445,
    activity_type: 'DiscussionActivity',
  },
  {
    id: 7446,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    activity_id: 'gather',
    description: 'desc',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    gather_text: 'Waiting for everyone to rejoin the group',
    polymorphic_ctype: 151,
    next_activity: null,
    activity_type: 'GatherActivity',
  },
  {
    id: 7445,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    activity_countdown_timer: null,
    casestudyuser_set: [],
    casestudyquestion_set: [
      {
        id: 228,
        question_text: 'Identity',
      },
      {
        id: 229,
        question_text: 'Norms',
      },
      {
        id: 230,
        question_text: 'Channels',
      },
    ],
    groups: [],
    activity_id: 'case_study_act',
    description: 'A case study activity',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 1,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    activity_seconds: 200,
    note_taker_instructions: 'Fill out the form below and press the submit button',
    participant_instructions: 'Work with the note-taker to complete your form',
    activity_title: 'Case Study',
    mainscreen_instructions: 'Work with your group to fill out the worksheet. Click submit when done.',
    case_study_details: 'Provide all the details you want them to have.',
    polymorphic_ctype: 153,
    next_activity: null,
    grouping_activity: 7444,
    activity_type: 'CaseStudyActivity',
  },
  {
    id: 7444,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    usergroup_set: [],
    grouping_countdown_timer: null,
    grouping_complete: false,
    activity_id: 'xtrnlgrouping_1',
    description: 'Simple Title',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    grouping_seconds: 90,
    polymorphic_ctype: 148,
    next_activity: null,
    activity_type: 'ExternalGroupingActivity',
  },
  {
    id: 7443,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    question: {
      id: 684,
      question: 'What was the outcome of the banker coin flip study?',
      mcqchoice_set: [
        {
          id: 2755,
          order: 4,
          choice_text: 'No significant difference',
          is_correct: false,
          explanation: 'you were near!',
        },
        {
          id: 2754,
          order: 3,
          choice_text: 'Both groups cheated',
          is_correct: false,
          explanation: 'you are right!',
        },
        {
          id: 2753,
          order: 2,
          choice_text: 'The group reminded they were bankers cheated half as much',
          is_correct: false,
          explanation: 'not correct',
        },
        {
          id: 2752,
          order: 1,
          choice_text: 'The group reminded they were bankers cheated 2x more',
          is_correct: true,
          explanation: 'you were way off!',
        },
      ],
    },
    question_timer: null,
    answered_participants: [],
    quiz_leaderboard: [
      {
        id: 8,
        score: 0,
      },
      {
        id: 18,
        score: 0,
      },
    ],
    titlecomponent: {
      title_image: 'emoji://thumbsup',
      title: 'Poll',
      screen_instructions: 'Answer the following question',
      participant_instructions: 'Answer the following questions.',
    },
    all_users_answered: false,
    activity_id: 'sample_mcq_3',
    description: 'hello world',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 10,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    question_seconds: 30,
    quiz_label: 'leader_board',
    polymorphic_ctype: 56,
    next_activity: null,
    activity_type: 'MCQActivity',
  },
  {
    id: 7442,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    title_image: 'emoji://lightbulb',
    activity_id: 'title_4',
    description: 'Title screen for Where do You stand section',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 60000,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    main_title: 'Listen up to the instructor',
    title_text: 'Phones down!',
    title_emoji: 'lightbulb',
    hide_timer: true,
    polymorphic_ctype: 40,
    next_activity: null,
    activity_type: 'TitleActivity',
  },
  {
    id: 7441,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    submission_countdown_timer: null,
    voting_countdown_timer: null,
    idea_rankings: [],
    user_submission_counts: [],
    user_vote_counts: [],
    activity_id: 'brainstorm_1',
    description: null,
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 30,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    instructions: 'Why might people not be honest in their disclosures?',
    submission_seconds: 300,
    voting_seconds: 300,
    submission_complete: false,
    voting_complete: false,
    max_user_submissions: 5,
    max_user_votes: 20,
    categorize_flag: false,
    polymorphic_ctype: 82,
    next_activity: null,
    activity_type: 'BrainstormActivity',
  },
  {
    id: 7440,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    discussion_countdown_timer: null,
    discussiongroup_set: [],
    currently_sharing_group: null,
    next_sharing_group: null,
    activity_id: 'discussion',
    description: 'What did you take away from this',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    title: 'Discuss with your partner',
    instructions: 'Why are people not honest in their disclosures?',
    participant_instructions: 'Why are people not honest in their disclosures?',
    num_sharers: 3,
    discussion_seconds: 120,
    sharing_seconds: 60,
    discussion_complete: false,
    polymorphic_ctype: 91,
    next_activity: null,
    group_from_activity: null,
    grouping_activity: 7439,
    notes_activity: null,
    activity_type: 'DiscussionActivity',
  },
  {
    id: 7439,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    usergroup_set: [],
    grouping_countdown_timer: null,
    grouping_complete: false,
    activity_id: 'xtrnlgrouping_0',
    description: 'Simple Title',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    grouping_seconds: 90,
    polymorphic_ctype: 148,
    next_activity: null,
    activity_type: 'ExternalGroupingActivity',
  },
  {
    id: 7438,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    question: {
      id: 683,
      question: 'What percentage of people fail to declare the extent of their tobacco usage?',
      mcqchoice_set: [
        {
          id: 2751,
          order: 4,
          choice_text: '32%',
          is_correct: false,
          explanation: 'you were near!',
        },
        {
          id: 2750,
          order: 3,
          choice_text: '22%',
          is_correct: true,
          explanation: 'you are right!',
        },
        {
          id: 2749,
          order: 2,
          choice_text: '15%',
          is_correct: false,
          explanation: 'not correct',
        },
        {
          id: 2748,
          order: 1,
          choice_text: '7%',
          is_correct: false,
          explanation: 'you were way off!',
        },
      ],
    },
    question_timer: null,
    answered_participants: [],
    quiz_leaderboard: [
      {
        id: 8,
        score: 0,
      },
      {
        id: 18,
        score: 0,
      },
    ],
    titlecomponent: {
      title_image: 'emoji://thumbsup',
      title: 'Poll',
      screen_instructions: 'Answer the following question',
      participant_instructions: 'Answer the following questions.',
    },
    all_users_answered: false,
    activity_id: 'sample_mcq_2',
    description: 'hello world',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 10,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    question_seconds: 60,
    quiz_label: 'leader_board',
    polymorphic_ctype: 56,
    next_activity: null,
    activity_type: 'MCQActivity',
  },
  {
    id: 7437,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    title_image: 'emoji://lightbulb',
    activity_id: 'title_3',
    description: 'Title screen for Where do You stand section',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 60000,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    main_title: 'Listen up to Matt',
    title_text: 'Phones down and eyes up.',
    title_emoji: 'lightbulb',
    hide_timer: true,
    polymorphic_ctype: 40,
    next_activity: null,
    activity_type: 'TitleActivity',
  },
  {
    id: 7436,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    question: {
      id: 682,
      question: 'How would you rank your driving?',
      mcqchoice_set: [
        {
          id: 2747,
          order: 5,
          choice_text: 'F1 Driver',
          is_correct: false,
          explanation: 'yay',
        },
        {
          id: 2746,
          order: 4,
          choice_text: 'Above Average',
          is_correct: false,
          explanation: 'yay',
        },
        {
          id: 2745,
          order: 3,
          choice_text: 'Average',
          is_correct: false,
          explanation: 'yay',
        },
        {
          id: 2744,
          order: 2,
          choice_text: 'Below Average',
          is_correct: false,
          explanation: 'yay',
        },
        {
          id: 2743,
          order: 1,
          choice_text: 'Very Poor',
          is_correct: false,
          explanation: 'yay',
        },
      ],
    },
    question_timer: null,
    answered_participants: [],
    quiz_leaderboard: null,
    titlecomponent: {
      title_image: 'emoji://thumbsup',
      title: 'Poll',
      screen_instructions: 'Answer the following question.',
      participant_instructions: 'Answer the following question.',
    },
    all_users_answered: false,
    activity_id: 'sample_mcq',
    description: 'hello world',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 0,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    question_seconds: 60,
    quiz_label: null,
    polymorphic_ctype: 56,
    next_activity: null,
    activity_type: 'MCQActivity',
  },
  {
    id: 7452,
    next_activity_start_timer: null,
    facilitation_status: 'not_started',
    feedbackquestion_set: [
      {
        id: 3047,
        question_type: 'rating_agreedisagree',
        question_text: 'I know how to apply behaviour science principles to my work.',
        is_combo: true,
        combo_text: 'Why did you provide your answer above?',
      },
      {
        id: 3046,
        question_type: 'rating_agreedisagree',
        question_text: 'I understand and can articulate the INSURE ME model.',
        is_combo: true,
        combo_text: 'Why did you provide your answer above?',
      },
    ],
    answered_participants: [],
    titlecomponent: {
      title_image: 'emoji://memo',
      title: 'Post-assessment',
      screen_instructions: 'Let’s check-in now on your understanding of the INSURE ME model before we begin.',
      participant_instructions:
        'Let’s check-in now on your understanding of the INSURE ME model before we begin.',
    },
    activity_id: 'benji_feedback_postassessment',
    description: 'Pre Assessment',
    start_time: null,
    end_time: null,
    next_activity_delay_seconds: 120,
    is_paused: false,
    auto_next: true,
    run_number: 0,
    polymorphic_ctype: 51,
    next_activity: null,
    activity_type: 'FeedbackActivity',
  },
];
