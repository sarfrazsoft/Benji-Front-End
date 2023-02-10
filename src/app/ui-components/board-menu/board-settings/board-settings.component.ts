import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BrainstormService } from 'src/app';
import { PostOrderOptions } from 'src/app/globals';
import {
  Board,
  BoardSort,
  BoardStatus,
  BoardTypes,
  BrainstormBoardSortOrderEvent,
  BrainstormChangeBoardStatusEvent,
  BrainstormClearBoardIdeaEvent,
  BrainstormToggleAllowCommentEvent,
  BrainstormToggleAllowHeartEvent,
  BrainstormToggleMeetingMode,
  BrainstormToggleParticipantNameEvent,
  EventTypes,
  SettingsTypes,
  SortOrderEntery,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation/confirmation.dialog';

@Component({
  selector: 'benji-board-settings',
  templateUrl: 'board-settings.component.html',
})
export class BoardSettingsComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  @Input() boardType: BoardTypes;
  @Input() allowedSettings: Array<SettingsTypes> = [];

  @Output() sendMessage = new EventEmitter<any>();
  @Output() settingsNavClosed = new EventEmitter<any>();
  postOrderDropdown: Array<SortOrderEntery> = PostOrderOptions;

  defaultSort = 'newest_to_oldest';
  participants = [];

  meetingMode: boolean;
  showAuthorship: boolean;
  allowCommenting: boolean;
  allowHearting: boolean;
  board: Board;

  selectedBoard: Board;
  boards: Array<Board> = [];

  hostname = window.location.host + '/participant/join?link=';
  boardsCount: number;
  menuBoard: any;
  hostBoard: number;

  showBottom = true;
  settingTypes = SettingsTypes;
  boardTypes = BoardTypes;
  lessonRunCode: number;

  constructor(
    private dialog: MatDialog,
    private brainstormService: BrainstormService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.lessonRunCode = this.activityState.lesson_run.lessonrun_code;

    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });

    this.brainstormService.meetingMode$.subscribe((meetingMode: boolean) => {
      this.meetingMode = meetingMode;
    });

    this.brainstormService.hostBoard$.subscribe((hostBoard: number) => {
      this.hostBoard = hostBoard;
    });

    if (!this.hostname.includes('localhost')) {
      this.hostname = 'https://' + this.hostname;
    }
  }

  selectedBoardChanged(board: Board) {
    this.selectedBoard = board;
    this.showAuthorship = this.selectedBoard.board_activity.show_participant_name_flag;
    this.allowCommenting = this.selectedBoard.allow_comment;
    this.allowHearting = this.selectedBoard.allow_heart;
    if (board.sort) {
      this.defaultSort = board.sort;
    }
  }

  ngOnChanges(): void {
    if (this.navType === 'boards') {
      if (this.activityState.eventType === EventTypes.hostChangeBoardEvent) {
      }
    }
  }

  getBoardsForParticipant() {
    return this.activityState.brainstormactivity.boards.filter((board) => board.removed === false);
  }

  getBoardParticipantCodes(board: Board) {
    if (this.activityState.brainstormactivity.participants[board.id].length) {
      return this.activityState.brainstormactivity.participants[board.id];
    } else {
      return null;
    }
  }

  closeNav() {
    this.sidenav.close();
    this.settingsNavClosed.emit();
  }

  duplicateBoard() {}

  toggleMeetingMode($event) {
    this.sendMessage.emit(new BrainstormToggleMeetingMode($event.currentTarget.checked));
  }

  toggleShowAuthorship() {
    this.sendMessage.emit(new BrainstormToggleParticipantNameEvent(this.selectedBoard.id));
  }

  toggleCommenting() {
    this.sendMessage.emit(new BrainstormToggleAllowCommentEvent(this.selectedBoard.id));
  }

  toggleHearting() {
    this.sendMessage.emit(new BrainstormToggleAllowHeartEvent(this.selectedBoard.id));
  }

  copyLink() {
    this.utilsService.copyToClipboard(this.hostname + this.activityState.lesson_run.lessonrun_code);
  }

  setMenuBoard(board: Board) {
    this.menuBoard = board.id;
  }

  clearBoard() {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'Are you sure you want to delete all posts? This action can not be undone?',
          actionButton: 'Delete',
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.sendMessage.emit(new BrainstormClearBoardIdeaEvent(this.selectedBoard.id));
        }
      });
  }

  changeOrder(order: { value: BoardSort; name: string }) {
    this.sendMessage.emit(new BrainstormBoardSortOrderEvent(order.value, this.selectedBoard.id));
  }

  mediaUploaded(event) {
    console.log(event);
  }
}
