import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormService } from 'src/app';
import { Board, UpdateMessage, UpdatePromptVideoEvent } from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { TopicMediaService } from 'src/app/services/topic-media.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FileProgress } from 'src/app/shared/components/uploadcare-widget/uploadcare-widget.component';

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
  uploadedTopicMedia: boolean;
  fileProgress: FileProgress;

  image;
  video;
  hasMedia = false;
  convertedUrl;
  originalUrl;

  constructor(private brainstormService: BrainstormService, private topicMediaService: TopicMediaService) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });

    this.topicMediaService.topicMedia$.subscribe((val: any) => {
      if (val) {
        this.getTopicMedia(val);
      }
    });

    if (this.selectedBoard.prompt_video) {
      this.getTopicMedia(this.selectedBoard.prompt_video);
    }
  }

  getTopicMedia(val) {
    this.uploadingTopicMedia = false;
    if (Object.keys(val).length) {
      this.hasMedia = true;
      if (val.isImage) {
        this.image = val;
        this.video = false;
      } else {
        this.image = false;
        this.video = val;
        this.convertedUrl = this.video.converted_file;
        this.originalUrl = this.video.original_file;
      }
    } else {
      // object is empty. no media has been selected or it
      // has been removed
      this.hasMedia = false;
    }
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;
  }

  getBoardsForAdmin() {
    return this.activityState.brainstormactivity.boards.filter((board) => board.removed === false);
  }

  mediaUploaded(media: any) {
    this.uploadingTopicMedia = false;
    this.uploadedTopicMedia = true;
    if (media.isImage) {
      this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, media));
    } else if (!media.isImage) {
      this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, media));
    }
  }

  removeMedia() {
    this.hasMedia = false;
    this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, null));
  }

  mediaUploadProgress(fileProgress: FileProgress) {
    this.fileProgress = fileProgress;
    this.uploadedTopicMedia = false;
    this.uploadingTopicMedia = true;
  }
}
