import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { clone, cloneDeep, forOwn, uniqBy } from 'lodash';
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
  BoardMode,
  BrainstormActivity,
  Group,
  Idea,
  Timer,
  UpdateMessage,
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
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
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
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService
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
  boardMode: BoardMode;

  participant_set = [];

  ngOnInit() {
    super.ngOnInit();
    this.participantCode = this.getParticipantCode();
    this.act = this.activityState.brainstormactivity;

    this.eventType = this.getEventType();

    this.selectUserBoard();
    
    this.initBoardInstructions();

    // get the new boardmode whenever board is changed
    this.brainstormService.selectedBoard$.subscribe((val: Board) => {
      if (val) {
        this.boardMode = val.board_activity.mode;
      }
    });

    this.onChanges();
  }

  ngAfterViewInit(): void {
    const currentLessonRunCode = this.activityState.lesson_run.lessonrun_code.toString();
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        if (localStorage.getItem('currentLessonRunCode' + currentLessonRunCode) !== currentLessonRunCode) {
          this.firstLaunchEvent.emit();
          localStorage.setItem('currentLessonRunCode' + currentLessonRunCode, currentLessonRunCode);
        }
      }
    });
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
      this.eventType === 'BrainstormEditSubInstruction'
    ) {
      //this.selectUserBoard();
      this.initBoardInstructions();
    } else if (this.eventType === 'JoinEvent') {
      this.detectNewParticipantJoined(this.activityState);
      this.selectUserBoard();
    } else if (this.eventType === 'HostChangeBoardEvent') {
      this.hostChangedBoard();
    } else if (this.eventType === 'ParticipantChangeBoardEvent') {
      this.participantChangedBoard();
    } else if (this.eventType === 'BrainstormChangeModeEvent') {
      this.getNewBoardMode(act, (mode) => {
        this.boardMode = mode;
      });
    } else {
      this.selectUserBoard();
    }

    // const sm = this.activityState;
    // if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
    //   const gt = sm.running_tools.grouping_tool;
    //   this.sharingToolService.updateParticipantGroupingToolDialog(gt);
    // }
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

  hostChangedBoard() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
      }
    });
    if (this.act.meeting_mode) {
      this.selectedBoard = this.getParticipantBoard();
      this.brainstormService.selectedBoard = this.selectedBoard;
    }
  }

  participantChangedBoard() {
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.getParticipantBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
      }
    });
  }

  initBoardInstructions () {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.brainstormService.boardTitle = this.selectedBoard.board_activity.instructions;
        this.brainstormService.boardInstructions = this.selectedBoard.board_activity.sub_instructions;
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.getParticipantBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
        this.brainstormService.boardTitle = this.selectedBoard.board_activity.instructions;
        this.brainstormService.boardInstructions = this.selectedBoard.board_activity.sub_instructions;
      }
    });
  }

  selectUserBoard() {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.getParticipantBoard();
        this.brainstormService.selectedBoard = this.selectedBoard;
      }
    });
  }

  getParticipantBoard() {
    let selectedBoard: Board;
    const boardParticipants = this.act.participants;
    if (boardParticipants) {
      forOwn(boardParticipants, (boardParticipantArray, participantsBoardId) => {
        for (let i = 0; i < boardParticipantArray.length; i++) {
          const participantCode = boardParticipantArray[i];
          if (participantCode === this.participantCode) {
            this.act.boards.forEach((board) => {
              if (Number(participantsBoardId) === board.id) {
                selectedBoard = board;
              }
            });
          }
        }
      });
    }
    return selectedBoard;
  }

  getAdminBoard() {
    let selectedBoard: Board;
    const hostBoardID = this.act.host_board;
    if (hostBoardID) {
      this.act.boards.forEach((v) => {
        if (hostBoardID === v.id) {
          selectedBoard = v;
        }
      });
    }
    return selectedBoard;
  }

  getNewBoardMode(act: BrainstormActivity, onSuccess) {
    let mode: BoardMode;
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.selectedBoard = this.getAdminBoard();
        mode = this.selectedBoard.board_activity.mode;
        onSuccess(mode);
      }
    });
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.selectedBoard = this.getParticipantBoard();
        mode = this.selectedBoard.board_activity.mode;
        onSuccess(mode);
      }
    });
  }

  detectNewParticipantJoined(act: UpdateMessage) {
    if (this.participant_set.length === act.lesson_run.participant_set.length) {
      return;
    } else {
      this.participant_set = act.lesson_run.participant_set;
    }
  }

  // getParticipantGroup(participantCode, participantGroups) {
  //   return this.brainstormService.getMyGroup(participantCode, participantGroups);
  // }

  // initParticipantGrouping(act: BrainstormActivity) {
  //   // Check if groups are created
  //   // if groups are present then check if participant is in the group
  //   // if participant is not present in the group then open grouping info dialog
  //   this.participantGroups = this.act.grouping.groups;
  //   if (this.participantGroups.length > 0) {
  //     this.myGroup = this.getParticipantGroup(this.participantCode, this.participantGroups);
  //     if (this.myGroup === null) {
  //       // There are groups in the activity but this participant is not in any groups
  //       if (this.dialogRef) {
  //         this.sharingToolService.updateParticipantGroupingInfoDialog(
  //           this.activityState.running_tools.grouping_tool
  //         );
  //         // this.dialogRef.close();
  //         // this.dialogRef = null;
  //       } else if (!this.dialogRef || !this.dialogRef.componentInstance) {
  //         this.dialogRef = this.sharingToolService.openParticipantGroupingInfoDialog(
  //           this.activityState,
  //           this.participantCode
  //         );
  //         // this.dialogRef =
  //         // this.sharingToolService.openParticipantGroupingToolDialog(this.activityState);
  //         this.sharingToolService.sendMessage$.subscribe((v) => {
  //           if (v) {
  //             this.sendMessage.emit(v);
  //           }
  //         });
  //       }
  //     } else {
  //       // filter ideas on participant screen by the group they are in.
  //       this.filterIdeasBasedOnGroup(this.myGroup);
  //       if (this.dialogRef) {
  //         this.dialogRef.close();
  //       }
  //     }
  //   }
  // }

  // resetGrouping() {
  //   const activityType = this.getActivityType().toLowerCase();
  //   this.sendMessage.emit(new ResetGroupingEvent(this.activityState[activityType].grouping.id));
  // }

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
