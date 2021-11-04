import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivityTypes, AllowShareActivities } from 'src/app/globals';
import { ContextService, GroupingToolService, SharingToolService } from 'src/app/services';
import { Timer, UpdateMessage } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import {
  BeginShareEvent,
  BrainstormSubmissionCompleteInternalEvent,
  BrainstormVotingCompleteInternalEvent,
  EndShareEvent,
  FastForwardEvent,
  JumpEvent,
  NextInternalEvent,
  PauseActivityEvent,
  PreviousEvent,
  ResetEvent,
  ResumeActivityEvent,
  ViewGroupingEvent,
} from '../../services/backend/schema/messages';
import { LayoutService } from '../../services/layout.service';
import { GroupingParticipantDialogComponent } from 'src/app/shared/dialogs';
@Component({
  selector: 'benji-main-screen-toolbar',
  templateUrl: './main-screen-toolbar.component.html',
  styleUrls: ['./main-screen-toolbar.component.scss'],
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
  @Input() lessonName: string;
  @Input() roomCode: string;
  @Input() isPaused: boolean;
  @Input() isGrouping: boolean;

  showTimer = false;
  currentActivityIndex;

  at: typeof ActivityTypes = ActivityTypes;

  shareParticipantLink = '';
  shareFacilitatorLink = '';
  allowShareActivities = AllowShareActivities;

  @ViewChild('groupingMenuTrigger') groupingMenuTrigger: MatMenuTrigger;
  constructor(
    private layoutService: LayoutService,
    public contextService: ContextService,
    private utilsService: UtilsService,
    private sharingToolService: SharingToolService,
    private groupingToolService: GroupingToolService,
    private matDialog: MatDialog
  ) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {
    this.shareParticipantLink = window.location.href + '?share=participant';
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
  }

  copyMessage(val: string) {
    this.utilsService.copyToClipboard(val);
  }

  ngOnChanges() {}

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

  groupingMenuClicked() {
    let activityID = '';
    const activity_type = this.activityState.activity_type.toLowerCase();
    const state = this.activityState;
    activityID = state[activity_type].activity_id;
    const code = activityID + state.lesson_run.lessonrun_code;

    if (this.isGroupingShowing) {
      if (localStorage.getItem('isGroupingCreated') === code) {
        // grouping ui is showing but grouping has been created for this activity
        // go back to activity screen
        this.groupingToolService.showGroupingToolMainScreen = false;
      } else {
        // the grouping UI is showing but grouping has not been created
        // for this activity
        // hide grouping UI
        this.socketMessage.emit(new ViewGroupingEvent(false));
      }
    } else {
      if (localStorage.getItem('isGroupingCreated') === code) {
        // grouping ui is not showing but grouping has been created for this activity
        // only show UI on mainscreen
        this.groupingToolService.showGroupingToolMainScreen =
          !this.groupingToolService.showGroupingToolMainScreen;
      } else {
        // the grouping UI is not showing and the grouping hasn't been created
        // for this activity
        // open menu
        this.groupingMenuTrigger.openMenu();
      }
    }
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
    const dialogRef = this.matDialog.open(GroupingParticipantDialogComponent, {
      panelClass: 'grouping-participant-dialog',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Use Template') {
      }
    });
  }
}
