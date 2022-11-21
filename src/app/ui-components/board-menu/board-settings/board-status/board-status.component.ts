import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BrainstormService } from 'src/app';
import { Board, BoardStatus, BrainstormChangeBoardStatusEvent } from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
@Component({
  selector: 'benji-board-status',
  templateUrl: 'board-status.component.html',
})
export class BoardStatusComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<any>();

  currentboardStatus: BoardStatus;

  boardStatusDropdown: Array<{ value: BoardStatus; name: string }> = [
    {
      value: 'open',
      name: 'Open',
    },
    {
      value: 'closed',
      name: 'Hidden',
    },
    {
      value: 'view_only',
      name: 'View Only',
    },
    {
      value: 'private',
      name: 'Private',
    },
  ];
  defaultSize = 'small';
  selectedBoard: Board;

  constructor(private brainstormService: BrainstormService, private boardStatusService: BoardStatusService) {}

  ngOnInit(): void {
    this.boardStatusService.boardStatus$.subscribe((status: BoardStatus) => {
      if (status) {
        this.currentboardStatus = status;
      }
    });

    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });
  }

  selectedBoardChanged(board: Board) {
    this.selectedBoard = board;
    this.currentboardStatus = board.status;
  }

  setBoardStatus() {
    console.log(this.selectedBoard, this.currentboardStatus);
    this.sendMessage.emit(
      new BrainstormChangeBoardStatusEvent(this.currentboardStatus, this.selectedBoard.id)
    );
  }
}
