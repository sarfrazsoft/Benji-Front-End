import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BrainstormService } from 'src/app';
import { Board, BoardTypes, EventTypes, SettingsTypes, UpdateMessage } from 'src/app/services/backend/schema';
import { isSet } from 'src/app/shared/util/value';

@Component({
  selector: 'benji-board-menu',
  templateUrl: 'board-menu.component.html',
})
export class BoardMenuComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() sidenav: MatSidenav;
  @Input() navType: string;
  @Output() sendMessage = new EventEmitter<any>();
  @Output() settingsNavClosed = new EventEmitter<any>();

  allowedSettings: Array<SettingsTypes> = [];
  boardSetttings: Array<SettingsTypes> = [
    SettingsTypes.TOPIC_MEDIA,
    SettingsTypes.BOARD_STATUS,
    SettingsTypes.POST,
    SettingsTypes.POST_ORDER,
    SettingsTypes.BOARD_MODE,
    SettingsTypes.ADMIN,
  ];

  pageSetttings = [SettingsTypes.BOARD_STATUS, SettingsTypes.ADMIN];

  selectedBoard: Board;

  boardType: BoardTypes;
  boardTypes = BoardTypes;
  oldActivityState: UpdateMessage;

  constructor(private brainstormService: BrainstormService) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;

    this.boardType = this.selectedBoard?.meta?.boardType
      ? this.selectedBoard?.meta?.boardType
      : this.boardTypes.POSTS;

    this.allowedSettings = this.boardType === this.boardTypes.PAGE ? this.pageSetttings : this.boardSetttings;
  }

  ngOnChanges(): void {
    if (
      this.activityState.eventType !== EventTypes.brainstormSubmitIdeaCommentEvent &&
      this.activityState.eventType !== EventTypes.notificationEvent
    ) {
      this.oldActivityState = this.activityState;
    }
  }

  isSet(boardType) {
    return isSet(boardType);
  }
}
