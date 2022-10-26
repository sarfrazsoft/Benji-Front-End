import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ContextService } from 'src/app';
import {
  Board,
  BoardStatus,
  BoardTypes,
  BrainstormAddBoardEventBaseEvent,
  BrainstormToggleMeetingMode,
  EventTypes,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { openClose } from 'src/app/shared/util/animations';

@Component({
  selector: 'benji-add-controls',
  templateUrl: 'add-controls.component.html',
  animations: [openClose()],
})
export class AddControlsComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() boards: Array<Board> = [];
  @Output() sendMessage = new EventEmitter<any>();

  meetingMode: boolean;
  board: Board;
  boardsCount: number;
  isAddNewPopupShown = false;

  addBoardSrc = '/assets/img/side-nav/rectangles.svg';
  addPageSrc = '/assets/img/side-nav/paper.svg';

  constructor(public contextService: ContextService) {}

  ngOnInit(): void {
    this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
  }

  ngOnChanges(): void {
    if (this.activityState.eventType === 'BrainstormAddBoardEventBaseEvent') {
    } else if (this.activityState.eventType === 'BrainstormRemoveBoardEvent') {
    } else if (this.activityState.eventType === 'GetUpdatedLessonDetailEvent') {
    }
    if (this.activityState.eventType === EventTypes.hostChangeBoardEvent) {
    } else if (this.activityState.eventType === EventTypes.brainstormToggleMeetingMode) {
      this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
    } else {
    }
  }

  addBoard(previousBoard: Board) {
    this.sendMessage.emit(
      new BrainstormAddBoardEventBaseEvent(
        'Board ' + this.boards.length,
        previousBoard.id,
        previousBoard.next_board,
        '',
        '',
        { boardType: BoardTypes.POSTS }
      )
    );
  }

  addPage(previousBoard: Board) {
    this.sendMessage.emit(
      new BrainstormAddBoardEventBaseEvent(
        'Board ' + this.boards.length,
        previousBoard.id,
        previousBoard.next_board,
        '',
        '',
        { boardType: BoardTypes.PAGE }
      )
    );
  }

  toggleMeetingMode($event) {
    this.sendMessage.emit(new BrainstormToggleMeetingMode($event.currentTarget.checked));
  }

  showAddNewPopup(): void {
    this.isAddNewPopupShown = !this.isAddNewPopupShown;
  }

  close($event) {
    if (this.isAddNewPopupShown) {
      this.isAddNewPopupShown = false;
    }
  }
}
