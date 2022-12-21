import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  Board,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  EventTypes,
  TopicMedia,
} from 'src/app/services/backend/schema';
import { TopicMediaService } from 'src/app/services/topic-media.service';

@Component({
  selector: 'benji-page',
  templateUrl: './page.component.html',
})
export class PageComponent implements OnInit, OnChanges {
  @Input() lessonRunCode;
  @Input() board: Board;
  @Input() isHost: boolean;
  @Input() eventType: string;
  @Output() sendMessage = new EventEmitter<any>();

  sub_instructions: string;
  myObservable = new Subject<string>();
  hasMedia: boolean;
  imageSrc: string;
  hasImage: boolean;
  hasVideo: boolean;
  video: any;
  convertedUrl: any;
  originalUrl: any;

  constructor(
    private topicMediaService: TopicMediaService
  ) {}

  ngOnInit() {
    const sub_instructions = this.board.board_activity?.sub_instructions;
    this.setupPageContents(sub_instructions);

    this.myObservable.pipe(debounceTime(1000)).subscribe((val: string) => {
      const title = this.getTitle(val);
      if (title && title !== this.board.board_activity.instructions) {
        this.sendMessage.emit(new BrainstormEditInstructionEvent(title, this.board.id));
      }
      this.sendMessage.emit(new BrainstormEditSubInstructionEvent(val, this.board.id));
    });


    if (this.board.prompt_video) {
      this.getTopicMedia(this.board.prompt_video);
    }

    this.topicMediaService.topicMedia$.subscribe((val: any) => {
      if (val) {
        this.getTopicMedia(val);
      }
    });

  }

  ngOnChanges() {
    // only update the page contents only when it's a participant
    if (!this.isHost && this.eventType === 'BrainstormEditSubInstruction') {
      const sub_instructions = this.board.board_activity?.sub_instructions;
      this.setupPageContents(sub_instructions);
    } else if (
      this.eventType === EventTypes.hostChangeBoardEvent ||
      this.eventType === EventTypes.participantChangeBoardEvent
    ) {
      const sub_instructions = this.board.board_activity?.sub_instructions;
      this.setupPageContents(sub_instructions);
    }
  }

  setupPageContents(contents: string) {
    this.sub_instructions = contents;
  }

  sendSocketMessage($event): void {
    this.sendMessage.emit($event);
  }

  pageTextUpdated($event: string): void {
    this.myObservable.next($event);
  }

  getTitle(val: string): string {
    const parser = new DOMParser();
    const document = parser.parseFromString(val, 'text/html');
    return document.getElementsByTagName('h1')[0]?.innerHTML ?? '';
  }

  getTopicMedia(val: TopicMedia) {
    if (val.uploadcare) {
      if (Object.keys(val.uploadcare).length) {
        this.hasMedia = true;
        if (val.uploadcare.isImage) {
          this.imageSrc = val.uploadcare.cdnUrl;
          this.hasImage = true;
          this.hasVideo = false;
          this.video = null;
        } else {
          this.hasImage = false;
          this.imageSrc = null;
          this.hasVideo = true;
          this.video = val.uploadcare;
          this.convertedUrl = this.video.converted_file;
          this.originalUrl = this.video.original_file;
        }
      }
    } else if (val.unsplash) {
      this.imageSrc = val.unsplash.image_path;
      this.hasImage = true;
      this.hasMedia = true;
      this.hasVideo = false;
      this.video = null;
    } else {
      this.imageSrc = null;
      this.video = false;
      this.convertedUrl = '';
      this.originalUrl = '';
      this.hasMedia = false;
    }
  }
}
