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
import { Board, Timer, UpdateMessage } from 'src/app/services/backend/schema';
import { GroupingToolGroups, Participant } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import { ParticipantGroupingDialogComponent } from 'src/app/shared/dialogs/participant-grouping-dialog/participant-grouping.dialog';
import { SessionSettingsDialogComponent } from 'src/app/shared/dialogs/session-settings-dialog/session-settings.dialog';
import {
  BeginShareEvent,
  BrainstormSubmissionCompleteInternalEvent,
  EndShareEvent,
  HostChangeBoardEvent,
  GetUpdatedLessonDetailEvent,
  JumpEvent,
  NextInternalEvent,
  ParticipantChangeBoardEvent,
  PauseActivityEvent,
  PreviousEvent,
  ResetEvent,
  ResumeActivityEvent,
} from '../../services/backend/schema/messages';

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
  @Input() isEditor = false;
  @Input() disableControls: boolean;
  @Input() isSharing: boolean;
  @Input() isGroupingShowing: boolean;
  @Input() isLastActivity: boolean;
  @Input() showHeader: boolean;
  @Input() lesson;
  @Input() roomCode: string;
  @Input() isPaused: boolean;
  @Input() isGrouping: boolean;
  @Input() participantCode: number;

  showTimer = false;
  currentActivityIndex;

  at: typeof ActivityTypes = ActivityTypes;

  shareParticipantLink = '';
  hostname = window.location.host + '/participant/join?link=';
  shareFacilitatorLink = '';
  allowShareActivities = AllowShareActivities;
  activitySettingsAllowed = ActivitySettingsAllowed;

  openGroupAccess = false;

  participantCodes = [];

  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';
  counterAfter = 4;

  @Output() sideNavEvent = new EventEmitter<string>();

  @ViewChild('groupingMenuTrigger') groupingMenuTrigger: MatMenuTrigger;
  @ViewChild('activitySettingsMenuTrigger') settingsMenuTrigger: MatMenuTrigger;
  lessonName: string;

  selectedBoard: Board;

  constructor(
    public contextService: ContextService,
    private utilsService: UtilsService,
    private sharingToolService: SharingToolService,
    private matDialog: MatDialog,
    private permissionsService: NgxPermissionsService,
    private router: Router,
  ) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {
    this.shareFacilitatorLink = window.location.href + '?share=facilitator';

    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.darkLogo = info.parameters.darkLogo;
      }
    });

    this.contextService.activityTimer$.subscribe((timer: Timer) => {
      if (timer && timer.total_seconds !== 0) {
        this.showTimer = true;
      } else {
        this.showTimer = false;
      }
    });

    this.showParticipantGroupingButton();
    this.shareParticipantLink = this.hostname + this.roomCode;
  }

  showParticipantGroupingButton() {
    if (!this.activityState || !this.activityState.activity_type) {
      return;
    }
    const currentActivity = this.activityState[this.activityState.activity_type.toLowerCase()];
    const grouping: GroupingToolGroups = currentActivity.grouping;
    if (grouping) {
      if (grouping.style === 'hostAssigned') {
        this.openGroupAccess = false;
      } else if (grouping.style === 'selfAssigned') {
        this.openGroupAccess = true;
      }
    }
  }

  copyMessage(val: string) {
    this.utilsService.copyToClipboard(val);
  }

  ngOnChanges() {
    this.lessonName = this.lesson.lesson_name;
    this.showParticipantGroupingButton();
    this.loadParticipantCodes();
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

  navigateToActivity($event) {
    if (this.isSharing) {
      this.endSharingTool();
    }
    this.socketMessage.emit(new JumpEvent($event));
  }

  setCurrentActivityIndex(dropdownActivities) {
    const currentActivityId = this.activityState[this.activityState.activity_type.toLowerCase()].activity_id;
    dropdownActivities.forEach((act, i) => {
      if (act.activity_id === currentActivityId) {
        this.currentActivityIndex = i + 1;
      }
    });
  }

  openGroupingParticipantDialog() {
    const dialogRef = this.matDialog.open(ParticipantGroupingDialogComponent, {
      panelClass: 'participant-grouping-dialog',
      data: { activityState: this.activityState, participantCode: this.participantCode },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  isActivitySettingsAllowed(activityState: UpdateMessage) {
    if (activityState && this.activitySettingsAllowed.includes(activityState.activity_type)) {
      return true;
    } else {
      return false;
    }
  }

  openSideNav(type) {
    this.sideNavEvent.emit(type);
  }

  loadParticipantCodes() {
    this.participantCodes.length = 0;
    const p = [];
    this.activityState.lesson_run.participant_set.forEach((participant: Participant) => {
      p.push(participant.participant_code);
    });
    this.participantCodes = p;
  }

  copyLink(val: string) {
    this.utilsService.copyToClipboard(val);
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

  isFirstBoard() {
    const visibleBoards = this.activityState.brainstormactivity.boards.filter((board) => !board.removed);
    let minBoardOrder = 0;
    visibleBoards.forEach((brd: Board) =>{
      if (brd.order < minBoardOrder) {
        minBoardOrder = brd.order;
      }
    });
    return minBoardOrder == this.getHostBoardOrder();
  }

  isLastBoard() {
    const visibleBoards = this.activityState.brainstormactivity.boards.filter((board) => !board.removed);
    let maxBoardOrder = 0;
    visibleBoards.forEach((brd: Board) =>{
      if (brd.order > maxBoardOrder) {
        maxBoardOrder = brd.order;
      }
    });
    return maxBoardOrder == this.getHostBoardOrder();
  }

  getHostBoardOrder() {
    const visibleBoards = this.activityState.brainstormactivity.boards.filter((board) => !board.removed);
    let hostBoardOrder;
    visibleBoards.forEach((brd: Board) =>{
      if (this.activityState.brainstormactivity.host_board === brd.id) {
        hostBoardOrder = brd.order;
      }
    });
    return hostBoardOrder;
  }

  changeBoard(move: string) {
    const visibleBoards = this.activityState.brainstormactivity.boards.filter((board) => !board.removed);
    const hostBoardOrder = this.getHostBoardOrder();
    visibleBoards.forEach((brd: Board) =>{
      if (hostBoardOrder+1 === brd.order && move === "next") {
        this.navigateToBoard(brd)
      } else if (hostBoardOrder-1 === brd.order && move === "previous") {
        this.navigateToBoard(brd)
      }
    });
  }

  navigateToBoard(board: Board) {
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.socketMessage.emit(new ParticipantChangeBoardEvent(board.id));
      }
    });

    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.socketMessage.emit(new HostChangeBoardEvent(board.id));
      }
    });
  }

  logoClicked(){
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.router.navigate(['/dashboard/']);
      }
    });
    
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.activityState.lesson_run.participant_set.forEach((participant: Participant) => {
          if (participant.participant_code === this.participantCode && participant.email) {
            this.router.navigate(['/dashboard/']);
          }
        });
      }
    });
  }

}
