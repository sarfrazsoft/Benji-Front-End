import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, Subscription } from 'rxjs';
import {
  ActivitySettingsService,
  BrainstormService,
  ContextService,
  SharingToolService,
} from 'src/app/services';
import {
  Board,
  BrainstormActivity,
  Group,
  Idea,
  Timer,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ParticipantGroupingInfoDialogComponent } from 'src/app/shared/dialogs/participant-grouping-info-dialog/participant-grouping-info.dialog';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss'],
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() peakBackState = false;
  @Input() activityStage: Observable<string>;
  @Output() firstLaunchEvent = new EventEmitter<string>();
  peakBackStage = null;
  showParticipantUI = false;
  showParticipantsGroupsDropdown = false;
  participantCode;

  constructor(
    private contextService: ContextService,
    private sharingToolService: SharingToolService,
    private brainstormService: BrainstormService
  ) {
    super();
  }
  instructions = '';
  sub_instructions = '';
  timer: Timer;
  act: BrainstormActivity;

  submissionScreen = false;
  voteScreen = false;
  VnSComplete = false;
  categorizeFlag = false;
  showUserName = true;
  minWidth = 'small';
  colDeleted = 0;
  joinedUsers = [];
  answeredParticipants = [];
  unansweredParticipants = [];
  ideaSubmittedUsersCount = 0;
  voteSubmittedUsersCount = 0;
  dialogRef: MatDialogRef<ParticipantGroupingInfoDialogComponent>;
  shownSubmissionCompleteNofitication = false;

  // Groupings
  classificationTypes;
  participantGroups: Array<Group>;
  selectedClassificationType;
  selectedParticipantGroup: Group;
  myGroup: Group;

  imagesURLs = [
    'localhost/media/Capture_LGXPk9s.JPG',
    'localhost/media/Capture_LGXPk9s.JPG',
    '../../../../../assets//img/Desk_lightblue2.jpg',
  ];

  settingsSubscription;
  saveIdeaSubscription;
  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;

  selectedBoardIndex = 0;
  selectedBoard: Board;

  ngOnInit() {
    super.ngOnInit();
    this.participantCode = this.getParticipantCode();
    this.act = this.activityState.brainstormactivity;
    const hostBoardID = this.act.host_board;
    if (hostBoardID) {
      this.act.boards.forEach((v) => {
        if (hostBoardID === v.id) {
          this.selectedBoard = v;
        }
      });
    }
    this.brainstormService.selectedBoard = this.selectedBoard;
    this.eventType = this.getEventType();

    this.onChanges();

  }

  ngAfterViewInit(): void {
    const currentLessonRunCode = this.activityState.lesson_run.lessonrun_code.toString();
    if (localStorage.getItem('currentLessonRunCode') !== currentLessonRunCode) {
      this.firstLaunchEvent.emit();
      localStorage.setItem('currentLessonRunCode',  currentLessonRunCode);
    }
    
  }

  ngOnChanges() {
    this.onChanges();
  }

  onChanges() {
    this.eventType = this.getEventType();
    const act = this.activityState.brainstormactivity;
    this.act = cloneDeep(this.activityState.brainstormactivity);
    if (
      this.eventType === 'BrainstormEditBoardInstruction' ||
      this.eventType === 'BrainstormEditSubInstruction' ||
      this.eventType === 'HostChangeBoardEvent' ||
      this.eventType === 'BrainstormChangeModeEvent'
    ) {
    }
    const hostBoardID = this.act.host_board;
    if (hostBoardID) {
      this.act.boards.forEach((v) => {
        if (hostBoardID === v.id) {
          this.selectedBoard = v;
          this.brainstormService.selectedBoard = this.selectedBoard;
        }
      });
    }

    const sm = this.activityState;
    if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
      const gt = sm.running_tools.grouping_tool;
      this.sharingToolService.updateParticipantGroupingToolDialog(gt);
    }

  }

  ngOnDestroy() {
    this.contextService.destroyActivityTimer();
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    if (this.saveIdeaSubscription) {
      this.saveIdeaSubscription.unsubscribe();
    }
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  getUsersIdeas(act: BrainstormActivity): Array<Idea> {
    let arr: Array<Idea> = [];
    arr = arr.filter(
      (v, i, s) => i === s.findIndex((t) => t.submitting_participant === v.submitting_participant)
    );
    return arr;
  }

  sendSocketMessage($event) {
    this.sendMessage.emit($event);
  }

}
