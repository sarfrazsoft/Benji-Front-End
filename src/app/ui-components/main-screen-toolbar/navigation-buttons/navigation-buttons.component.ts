import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  BoardsNavigationService,
  BrainstormEventService,
  BrainstormService,
  ContextService,
} from 'src/app/services';
import { Board, EventTypes, UpdateMessage } from 'src/app/services/backend/schema';
import { HostChangeBoardEvent, ParticipantChangeBoardEvent } from '../../../services/backend/schema/messages';

@Component({
  selector: 'benji-board-navigation-buttons',
  templateUrl: './navigation-buttons.component.html',
  styleUrls: ['./navigation-buttons.component.scss'],
})
export class NavigationButtonsComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() participantCode: number;

  @Output() socketMessage = new EventEmitter<any>();

  selectedBoard: Board;
  isHost: boolean;
  isParticipant: boolean;

  allBoards: Array<Board> = [];
  hostBoardId: number;
  participantBoardId: number;

  _isNextNavigableBoardAvailable = false;
  _isPreviousNavigableBoardAvailable = false;

  constructor(
    public contextService: ContextService,
    private brainstormService: BrainstormService,
    private brainstormEventService: BrainstormEventService,
    private boardsNavigationService: BoardsNavigationService
  ) {}

  ngOnInit() {
    this.brainstormEventService.hostBoardId$.subscribe((hostBoardId: number) => {
      if (hostBoardId) {
        this.hostBoardId = hostBoardId;
        this.setUpNavigationButtons();
      }
    });

    this.brainstormEventService.participantBoardId$.subscribe((participantBoardId: number) => {
      if (participantBoardId) {
        this.participantBoardId = participantBoardId;
        this.setUpNavigationButtons();
      }
    });
  }

  ngOnChanges(changes) {
    if (this.activityState?.brainstormactivity?.boards) {
      this.allBoards = this.activityState.brainstormactivity.boards;
    }
    if (this.activityState?.brainstormactivity?.host_board) {
      this.hostBoardId = this.activityState.brainstormactivity.host_board;
    }
    if (this.activityState?.isHost) {
      this.isHost = this.activityState.isHost;
    }

    if (
      this.activityState.eventType === EventTypes.joinEvent ||
      this.activityState.eventType === EventTypes.brainstormToggleMeetingMode
    ) {
      this.setUpNavigationButtons();
    }
  }

  setUpNavigationButtons() {
    setTimeout(() => {
      this._isNextNavigableBoardAvailable = this.isNextNavigableBoardAvailable() ? true : false;
      this._isPreviousNavigableBoardAvailable = this.isPreviousNavigableBoardAvailable() ? true : false;
    }, 0);
  }

  propagate($event) {
    this.socketMessage.emit($event);
  }

  isPreviousNavigableBoardAvailable() {
    const currentBoard: Board = this.getCurrentBoard();

    return this.boardsNavigationService.isPreviousBoardAvailableToNavigate(this.allBoards, currentBoard);
  }

  isNextNavigableBoardAvailable() {
    const currentBoard: Board = this.getCurrentBoard();

    const x = this.boardsNavigationService.isNextBoardAvailableToNavigate(this.allBoards, currentBoard);
    return x;
  }

  changeBoard(move: 'next' | 'previous') {
    const currentBoard = this.getCurrentBoard();
    if (move === 'next') {
      if (currentBoard.next_board) {
        this.navigateToBoard(currentBoard.next_board);
      }
    } else if (move === 'previous') {
      if (currentBoard.previous_board) {
        this.navigateToBoard(currentBoard.previous_board);
      }
    }
  }

  getCurrentBoard(): Board {
    const board = this.isHost
      ? this.getHostBoard(this.allBoards, this.hostBoardId)
      : this.getParticipantBoard();
    return board;
  }

  getHostBoard(activityBoards: Array<Board>, hostBoardId: number): Board {
    const visibleBoards = activityBoards.filter((board) => !board.removed);
    let hostBoard;
    visibleBoards.forEach((brd: Board) => {
      if (hostBoardId === brd.id) {
        hostBoard = brd;
      }
    });
    return hostBoard;
  }

  getParticipantBoard(): Board {
    if (this.activityState.brainstormactivity) {
      if (this.participantCode) {
        return this.brainstormService.getParticipantBoard(
          this.activityState.brainstormactivity,
          this.participantCode
        );
      }
    } else if (this.participantBoardId) {
      return this.brainstormService.getParticipantBoardFromList(this.allBoards, this.participantBoardId);
    }
  }

  navigateToBoard(boardId: number) {
    this.isHost
      ? this.socketMessage.emit(new HostChangeBoardEvent(boardId))
      : this.socketMessage.emit(new ParticipantChangeBoardEvent(boardId));
  }
}
