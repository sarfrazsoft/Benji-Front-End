import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ActivitySettingsAllowed, ActivityTypes, AllowShareActivities } from 'src/app/globals';
import { ContextService, SharingToolService } from 'src/app/services';
import {
  Board,
  BoardParticipants,
  Branding,
  EventTypes,
  Timer,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { GroupingToolGroups, Lesson, Participant } from 'src/app/services/backend/schema/course_details';
import { LessonRunNotification, Notification } from 'src/app/services/backend/schema/notification';
import { UtilsService } from 'src/app/services/utils.service';
import { ParticipantGroupingDialogComponent } from 'src/app/shared/dialogs/participant-grouping-dialog/participant-grouping.dialog';
import { SessionSettingsDialogComponent } from 'src/app/shared/dialogs/session-settings-dialog/session-settings.dialog';
import {
  BrainstormSubmissionCompleteInternalEvent,
  EndShareEvent,
  GetUpdatedLessonDetailEvent,
  JumpEvent,
  MarkNotificationsReadEvent,
  NextInternalEvent,
  PauseActivityEvent,
  PreviousEvent,
  ResetEvent,
  ResumeActivityEvent,
} from '../../services/backend/schema/messages';
import { NotificationsComponent } from '../controls/notifications/notifications.component';

@Component({
  selector: 'benji-main-screen-toolbar',
  templateUrl: './main-screen-toolbar.component.html',
  styleUrls: ['./main-screen-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainScreenToolbarComponent implements OnInit, OnChanges {
  darkLogo = '';
  timer: Timer;
  @Input() activityState: UpdateMessage;
  @Input() hideControls = false;
  @Input() disableControls: boolean;
  @Input() isSharing: boolean;
  @Input() isGroupingShowing: boolean;
  @Input() showHeader: boolean;
  @Input() isPaused: boolean;
  @Input() isGrouping: boolean;
  @Input() participantCode: number;
  @Input() boardsMenuClosed: boolean;

  lesson: Lesson;
  roomCode: number;

  showTimer = false;
  currentActivityIndex;

  at: typeof ActivityTypes = ActivityTypes;

  shareFacilitatorLink = '';
  allowShareActivities = AllowShareActivities;
  activitySettingsAllowed = ActivitySettingsAllowed;

  openGroupAccess = false;

  participantCodes = [];

  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';
  counterAfter = 4;
  shareParticipantLink = '';

  @Output() openSettingsMenuEvent = new EventEmitter();
  @Output() toggleBoardsMenuEvent = new EventEmitter();
  @Output() socketMessage = new EventEmitter<any>();

  @ViewChild('groupingMenuTrigger') groupingMenuTrigger: MatMenuTrigger;
  @ViewChild('activitySettingsMenuTrigger') settingsMenuTrigger: MatMenuTrigger;
  lessonName: string;

  selectedBoard: Board;
  isHost: boolean;
  isParticipant: boolean;

  // nofications
  @ViewChild(NotificationsComponent) notificationsComponent: NotificationsComponent;

  // notificationList: Array<Notification | LessonRunNotification> = [];
  notificationCount = 0;
  hostname = window.location.host + '/participant/join?link=';

  _activityState: UpdateMessage;
  oldParticipantCode: number;

  constructor(
    public contextService: ContextService,
    private utilsService: UtilsService,
    private matDialog: MatDialog,
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.shareFacilitatorLink = window.location.href + '?share=facilitator';

    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.darkLogo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
      }
    });

    this.contextService.activityTimer$.subscribe((timer: Timer) => {
      if (timer && timer.total_seconds !== 0) {
        this.showTimer = true;
      } else {
        this.showTimer = false;
      }
    });

    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      val ? (this.isParticipant = true) : (this.isParticipant = false);
    });

    this.permissionsService.hasPermission('ADMIN').then((val) => {
      val ? (this.isHost = true) : (this.isHost = false);
    });

    this.shareParticipantLink = this.hostname + this.roomCode;
    if (!this.hostname.includes('localhost')) {
      this.hostname = 'https://' + this.hostname;
    }
  }

  copyMessage(val: string) {
    this.utilsService.copyToClipboard(val);
  }

  ngOnChanges() {
    // if event is brainstormSubmitIdeaCommentEvent don't assign it to local
    if (
      this.activityState.eventType === EventTypes.brainstormSubmitIdeaCommentEvent ||
      this.activityState.eventType === EventTypes.notificationEvent
    ) {
    } else {
      this._activityState = this.activityState;
      this.oldParticipantCode = this.participantCode;
    }

    if (this.activityState.eventType === EventTypes.joinEvent) {
      this.lessonName = this.activityState.lesson.lesson_name;
      this.loadParticipantCodes();

      this.lesson = this.activityState.lesson;
      this.roomCode = this.activityState.lesson_run.lessonrun_code;
    }

    // if (this.activityState.eventType === EventTypes.notificationEvent) {
    //   this.notificationList = this.activityState.notifications;
    //   if (this.notificationsComponent) {
    //     this.notificationsComponent.updateNotifications(this.notificationList);
    //   }
    // }
  }

  updateNotificationCount(count: number): void {
    this.notificationCount = count;
  }

  notificationMenuOpened(): void {
    // const ids = this.notificationList.map((n) => n.id);
    // this.socketMessage.emit(new MarkNotificationsReadEvent(ids));
  }

  markAsReadNotifications(notifications: Array<number>): void {
    this.socketMessage.emit(new MarkNotificationsReadEvent(notifications));
  }

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
    } else if (eventType === 'previous') {
      if (this.isSharing) {
        this.endSharingTool();
      }
      this.socketMessage.emit(new PreviousEvent());
    } else if (eventType === 'reset') {
      this.socketMessage.emit(new ResetEvent());
    }
  }

  brainstormSubmissionComplete($event) {
    this.socketMessage.emit(new BrainstormSubmissionCompleteInternalEvent());
  }

  propagate($event) {
    this.socketMessage.emit($event);
  }

  settingsMenuClicked() {
    this.settingsMenuTrigger.openMenu();
  }

  groupingMenuClicked() {
    this.groupingMenuTrigger.openMenu();
  }

  isSharingAllowed(activityState: UpdateMessage) {
    if (activityState && this.allowShareActivities.includes(activityState.activity_type)) {
      return true;
    } else {
      return false;
    }
  }

  startSharingTool() {}

  endSharingTool() {
    this.socketMessage.emit(new EndShareEvent());
  }

  navigateToActivity($event) {
    if (this.isSharing) {
      this.endSharingTool();
    }
    this.socketMessage.emit(new JumpEvent($event));
  }

  isActivitySettingsAllowed(activityState: UpdateMessage) {
    if (activityState && this.activitySettingsAllowed.includes(activityState.activity_type)) {
      return true;
    } else {
      return false;
    }
  }

  openSettingsMenu() {
    this.openSettingsMenuEvent.emit();
  }

  toggleBoardsMenu() {
    this.toggleBoardsMenuEvent.emit();
  }

  loadParticipantCodes() {
    this.participantCodes.length = 0;
    const p = [];

    this._activityState.lesson_run.participant_set.forEach((participant: Participant) => {
      if (participant.is_active) {
        p.push(participant.participant_code);
      }
    });
    this.participantCodes = p;
  }

  openSessionSettings() {
    this.matDialog
      .open(SessionSettingsDialogComponent, {
        data: {
          id: this.lesson.id,
          title: this.lesson.lesson_name,
          description: this.lesson.lesson_description,
          Create: false,
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        this.socketMessage.emit(new GetUpdatedLessonDetailEvent());
      });
  }

  logoClicked() {
    if (this.isHost) {
      this.router.navigate(['/dashboard/']);
    } else if (this.isParticipant) {
      this._activityState.lesson_run.participant_set.forEach((participant: Participant) => {
        if (participant.participant_code === this.participantCode && participant?.user?.id) {
          this.router.navigate(['/dashboard/']);
        }
      });
    }
  }

  signUpClicked() {
    this.router.navigateByUrl('/sign-up?link=' + this.roomCode + '&userCode=' + this.participantCode);
  }

  participantNotSignedIn() {
    // get localstorage item 'participant'
    // if participant does not have user property set then they
    // are not signedIn using benji team user
    if (localStorage.getItem('participant_' + this.roomCode)) {
      const participant: Participant = JSON.parse(localStorage.getItem('participant_' + this.roomCode));
      if (participant.user) {
        return false;
      } else {
        return true;
      }
    }
  }

  copyLink() {
    this.utilsService.copyToClipboard(this.shareParticipantLink);
  }
}
