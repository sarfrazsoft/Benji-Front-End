import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormService } from 'src/app';
import { Board, UpdateMessage, UpdatePromptVideoEvent } from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-topic-media',
  templateUrl: 'topic-media.component.html',
})
export class TopicMediaComponent implements OnInit {
  @Input() activityState: UpdateMessage;
  @Input() lessonRunCode: number;
  @Input() selectedBoard: Board;
  uploadingTopicMedia = false;
  @Output() sendMessage = new EventEmitter<any>();

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
  }

  getBoardsForAdmin() {
    return this.activityState.brainstormactivity.boards.filter((board) => board.removed === false);
  }

  mediaUploaded(media: any) {
    this.uploadingTopicMedia = false;
    if (media.isImage) {
      this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, media));
    } else if (!media.isImage) {
      this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, media));
    }
  }

  mediaUploadProgress() {
    this.uploadingTopicMedia = true;
  }
}
