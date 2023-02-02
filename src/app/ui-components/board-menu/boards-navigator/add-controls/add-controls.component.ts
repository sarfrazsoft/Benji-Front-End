import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BrainstormService, ContextService } from 'src/app';
import {
  Board,
  BoardTypes,
  BrainstormAddBoardEventBaseEvent,
  BrainstormToggleMeetingMode,
  EventTypes,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { open } from 'src/app/shared/util/animations';

@Component({
  selector: 'benji-add-controls',
  templateUrl: 'add-controls.component.html',
  animations: [open()],
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

  constructor(public contextService: ContextService, private brainstormService: BrainstormService) {}

  ngOnInit(): void {
    this.brainstormService.meetingMode$.subscribe((meetingMode: boolean) => {
      this.meetingMode = meetingMode;
    });
  }

  ngOnChanges(): void {
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
    this.close();
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
    this.close();
  }

  toggleMeetingMode($event) {
    this.sendMessage.emit(new BrainstormToggleMeetingMode($event.currentTarget.checked));
  }

  showAddNewPopup(): void {
    this.isAddNewPopupShown = !this.isAddNewPopupShown;
  }

  close() {
    if (this.isAddNewPopupShown) {
      this.isAddNewPopupShown = false;
    }
  }
}
