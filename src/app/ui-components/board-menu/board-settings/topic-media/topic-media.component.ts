import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrainstormService } from 'src/app';
import { Board, TopicMedia, UpdateMessage, UpdatePromptVideoEvent, UploadcareMedia } from 'src/app/services/backend/schema';
import { TopicMediaService } from 'src/app/services/topic-media.service';
import { FileProgress, UploadcareWidgetComponent } from 'src/app/shared/components/uploadcare-widget/uploadcare-widget.component';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';

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

  uploadFile: ElementRef<UploadcareWidgetComponent>;
  imageDialogRef: any;
  hasImage: boolean;
  hasVideo: boolean;
  topicMedia: TopicMedia;

  constructor(
    private brainstormService: BrainstormService,
    private topicMediaService: TopicMediaService,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });

    this.topicMediaService.topicMedia$.subscribe((val: TopicMedia) => {
      if (val) {
        this.topicMedia = val;
        this.getTopicMedia(val);
      }
    });

    if (this.selectedBoard.prompt_video) {
      this.getTopicMedia(this.selectedBoard.prompt_video);
    }
  }

  getTopicMedia(val: TopicMedia) {
    if (val.uploadcare) {
      this.uploadingTopicMedia = false;
      if (Object.keys(val.uploadcare).length) {
        this.hasMedia = true;
        if (val.uploadcare.isImage) {
          this.hasImage = true;
          this.image = val.uploadcare;
          this.hasVideo = false;
          this.video = null;
        } else {
          this.hasImage = false;
          this.image = null;
          this.hasVideo = true;
          this.video = val.uploadcare;
          this.convertedUrl = this.video.converted_file;
          this.originalUrl = this.video.original_file;
        }
      } else {
        // object is empty. no media has been selected or it
        // has been removed
        this.hasMedia = false;
      }
    }
    // console.log(this.image)
  }

  selectedBoardChanged(board) {
    this.selectedBoard = board;
  }

  mediaUploaded(media: UploadcareMedia) {
    this.topicMedia = {
      uploadcare: media,
      unsplash: {
        image_path: null
      }
    }
    this.topicMedia.unsplash = null;
    this.uploadingTopicMedia = false;
    this.uploadedTopicMedia = true;
    if (media.isImage) {
      this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, this.topicMedia));
    } else if (!media.isImage) {
      this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, this.topicMedia));
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

  openImagePickerDialog() {
    this.imageDialogRef = this.matDialog
      .open(ImagePickerDialogComponent, {
        disableClose: false,
        panelClass: ['dashboard-dialog', 'image-picker-dialog'],
        data: {
          'onlyUnsplash': true
        }

      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.topicMedia = {
            uploadcare: null,
            unsplash: {
              image_path: res.data
            }
          }
          this.sendMessage.emit(new UpdatePromptVideoEvent(this.selectedBoard.id, this.topicMedia));
        }
      })
  }
}
