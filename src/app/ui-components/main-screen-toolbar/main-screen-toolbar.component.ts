import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivityTypes } from 'src/app/globals';
import { ContextService, SharingToolService } from 'src/app/services';
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
} from '../../services/backend/schema/messages';
import { LayoutService } from '../../services/layout.service';
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
  @Input() isLastActivity: boolean;
  @Input() showHeader: boolean;

  showTimer = false;
  currentActivityIndex;

  at: typeof ActivityTypes = ActivityTypes;

  shareParticipantLink = '';
  shareFacilitatorLink = '';
  constructor(
    private layoutService: LayoutService,
    public contextService: ContextService,
    private utilsService: UtilsService,
    private sharingToolService: SharingToolService
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

  propagate($event) {
    this.socketMessage.emit($event);
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
}
