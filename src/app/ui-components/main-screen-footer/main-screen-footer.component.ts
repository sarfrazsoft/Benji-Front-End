import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { clone } from 'lodash';
import { ActivityTypes, AllowGroupingActivities, AllowShareActivities } from 'src/app/globals';
import {
  ContextService,
  GroupingToolService,
  PastSessionsService,
  SharingToolService,
} from 'src/app/services';
import { Timer, User } from 'src/app/services/backend/schema';
import { Lesson, Participant } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.dialog';
import { PeakBackDialogComponent } from '../../pages/lesson/shared/dialogs/';
import {
  BeginShareEvent,
  BootParticipantEvent,
  BrainstormSubmissionCompleteInternalEvent,
  BrainstormToggleCategoryModeEvent,
  BrainstormVotingCompleteInternalEvent,
  EndEvent,
  EndShareEvent,
  FastForwardEvent,
  JumpEvent,
  NextInternalEvent,
  PauseActivityEvent,
  PreviousEvent,
  ResetEvent,
  ResumeActivityEvent,
  ServerMessage,
  UpdateMessage,
  ViewGroupingEvent,
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
  @Input() isSharing: boolean;
  @Input() isGrouping: boolean;
  @Input() isGroupingShowing: boolean;
  @Input() isEditor = false;

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
  allowGroupingActivities = AllowGroupingActivities;

  @ViewChild('groupingMenuTrigger') groupingMenuTrigger: MatMenuTrigger;
  constructor(
    private videoStateService: VideoStateService,
    private dialog: MatDialog,
    private pastSessionsService: PastSessionsService,
    public contextService: ContextService,
    private utilsService: UtilsService,
    private router: Router,
    private sharingToolService: SharingToolService,
    private groupingToolService: GroupingToolService
  ) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {
    if (this.activityState && this.activityState.lesson) {
      this.lesson = this.activityState.lesson;
    }

    this.contextService.activityTimer$.subscribe((timer: Timer) => {
      if (timer && timer.total_seconds !== 0) {
        this.showTimer = true;
      } else {
        this.showTimer = false;
      }
    });
  }

  ngOnChanges() {
    this.fastForwarding = false;

    if (this.activityState) {
      this.participants = this.activityState.lesson_run.participant_set;
    }

    const as = this.activityState;

    if (as && as.running_tools && as.running_tools.share) {
      this.sharingToolService.sharingToolControl$.next(this.activityState);
    }
  }

  initializeTimer() {}

  controlClicked(eventType) {
    if (this.disableControls) {
      return false;
    }
    if (eventType === 'pause') {
      this.socketMessage.emit(new PauseActivityEvent());
    } else if (eventType === 'next') {
      if (this.isSharing) {
        this.endSharingTool();
      }
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
      if (this.isSharing) {
        this.endSharingTool();
      }
      this.socketMessage.emit(new PreviousEvent());
    } else if (eventType === 'reset') {
      this.socketMessage.emit(new ResetEvent());
    }
    // }
  }

  brainstormSubmissionComplete($event) {
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
    const as = this.activityState;

    if (as && as.running_tools && as.running_tools.share) {
      this.endSharingTool();
    } else {
      this.socketMessage.emit(new BeginShareEvent());
      this.sharingToolService.sharingToolControl$.next(this.activityState);
    }
  }
  endSharingTool() {
    this.socketMessage.emit(new EndShareEvent());
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

  isGroupingAllowed(activityState: UpdateMessage) {
    if (activityState && this.allowGroupingActivities.includes(activityState.activity_type)) {
      return true;
    } else {
      return false;
    }
  }

  navigateToActivity($event) {
    if (this.isSharing) {
      this.endSharingTool();
    }
    this.socketMessage.emit(new JumpEvent($event));
  }

  propagate($event) {
    this.socketMessage.emit($event);
  }

  showGroupingView() {}

  groupingMenuClicked() {
    const code =
      this.activityState.casestudyactivity.activity_id + this.activityState.lesson_run.lessonrun_code;

    if (this.isGroupingShowing) {
      if (localStorage.getItem('isGroupingCreated') === code) {
        // grouping ui is showing but grouping has been created for this activity
        // go back to activity screen
        this.groupingToolService.showGroupingToolMainScreen = false;
      } else {
        // the grouping UI is showing but grouping has not been created
        // for this activity
        // open menu
        this.groupingMenuTrigger.openMenu();
      }
    } else {
      if (localStorage.getItem('isGroupingCreated') === code) {
        // grouping ui is not showing but grouping has been created for this activity
        // only show UI on mainscreen
        this.groupingToolService.showGroupingToolMainScreen = !this.groupingToolService
          .showGroupingToolMainScreen;
      } else {
        // the grouping UI is not showing and the grouping hasn't been created
        // for this activity
        // open menu
        this.groupingMenuTrigger.openMenu();
      }
    }
    // const code =
    //   this.activityState.casestudyactivity.activity_id + this.activityState.lesson_run.lessonrun_code;
    // if (localStorage.getItem('isGroupingCreated') === code) {
    //   // grouping has been created we only show UI from now on
    //   if (this.isGroupingShowing) {
    //     this.socketMessage.emit(new ViewGroupingEvent(false));
    //   } else {
    //     this.socketMessage.emit(new ViewGroupingEvent(true));
    //   }
    // } else {
    //   // grouping has not been created yet open the menu
    //   this.groupingMenuTrigger.openMenu();
    // }
  }

  hideGroupingView() {}
}
