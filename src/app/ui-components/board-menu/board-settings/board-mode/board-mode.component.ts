import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrainstormService } from 'src/app';
import {
  Board,
  BoardMode,
  BrainstormChangeModeEvent,
  UpdateMessage,
  UpdatePromptVideoEvent,
} from 'src/app/services/backend/schema';
import { TopicMediaService } from 'src/app/services/topic-media.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FileProgress } from 'src/app/shared/components/uploadcare-widget/uploadcare-widget.component';

@Component({
  selector: 'benji-board-mode',
  templateUrl: 'board-mode.component.html',
})
export class BoardModeComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<any>();

  selectedBoard: Board;
  boardMode: BoardMode;
  gridMode: boolean;
  threadMode: boolean;
  columnsMode: boolean;

  constructor(private brainstormService: BrainstormService, private topicMediaService: TopicMediaService) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });

    this.brainstormService.boardMode$.subscribe((boardMode: BoardMode) => {
      if (boardMode) {
        this.decideBoardMode(boardMode);
      }
    });
  }

  setBoardMode(mode: BoardMode) {
    this.sendMessage.emit(new BrainstormChangeModeEvent(mode, this.selectedBoard.id));
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;
    this.boardMode = this.selectedBoard.board_activity.mode;
    this.decideBoardMode(this.boardMode);
  }

  decideBoardMode(mode: BoardMode): void {
    console.log(mode);
    this.boardMode = mode;
    switch (mode) {
      case 'grid':
        this.gridMode = true;
        this.threadMode = false;
        this.columnsMode = false;
        break;
      case 'thread':
        this.gridMode = false;
        this.threadMode = true;
        this.columnsMode = false;
        break;
      default:
        this.gridMode = false;
        this.threadMode = false;
        this.columnsMode = true;
    }
  }
}
