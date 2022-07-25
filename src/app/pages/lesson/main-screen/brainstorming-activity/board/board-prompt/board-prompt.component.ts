import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { cloneDeep } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BrainstormService } from 'src/app/services';
import {
  Board,
  BoardMode,
  BoardStatus,
  BrainstormActivity,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { TopicMediaService } from 'src/app/services/topic-media.service';

// declare var iframely: any;

@Component({
  selector: 'benji-board-prompt',
  templateUrl: './board-prompt.component.html',
})
export class BoardPromptComponent implements OnInit, OnChanges, OnDestroy {
  @Input() board: Board;
  @Input() activityState: UpdateMessage;
  @Input() eventType;
  @Input() boardMode: BoardMode;
  @Input() isHost = false;
  boardStatus;

  showParticipantsGroupsDropdown = false;
  @Input() participantCode;
  @ViewChild('title') InstructionsElement: ElementRef;
  @ViewChild('instructions') SubInstructionsElement: ElementRef;

  title_instructions = '';
  sub_instructions = '';
  act: BrainstormActivity;
  lessonRunCode: number;

  hasMedia = true;
  private typingTimer;
  myObservable = new Subject<string>();
  image;
  video;

  convertedUrl;
  originalUrl;

  @Output() sendMessage = new EventEmitter<any>();
  @Output() postIdeaEventEmitter = new EventEmitter<any>();

  constructor(
    private permissionsService: NgxPermissionsService,
    private brainstormService: BrainstormService,
    private topicMediaService: TopicMediaService,
    private boardStatusService: BoardStatusService
  ) {}

  ngOnInit() {
    // super.ngOnInit();
    this.act = this.activityState.brainstormactivity;
    this.lessonRunCode = this.activityState.lesson_run.lessonrun_code;

    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.participantCode = this.participantCode;
        this.isHost = false;
      }
    });

    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.isHost = true;
      }
    });

    this.getNewBoardInstruction(this.board);
    this.getNewSubInstruction(this.board);

    this.myObservable.pipe(debounceTime(1000)).subscribe((val: any) => {
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

    this.boardStatusService.boardStatus$.subscribe((val: BoardStatus) => {
      if (val) {
        this.boardStatus = val;
      }
    });
  }

  isPostingAllowed() {
    if (this.isHost) {
      // if it's a host allow posting without any consideration
      // to board status
      return true;
    } else if (this.boardStatus === 'open' || this.boardStatus === 'private') {
      // is participant
      return true;
    } else {
      return false;
    }
  }

  getTopicMedia(val) {
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
      this.hasMedia = false;
      this.image = false;
      this.video = false;
      this.convertedUrl = '';
      this.originalUrl = '';
    }
  }

  ngOnChanges() {
    this.onChanges();
  }

  onChanges() {
    this.act = cloneDeep(this.activityState.brainstormactivity);
    if (!this.isHost) {
      // apply new instructions only if the user is not host.
      if (this.eventType === 'BrainstormEditBoardInstruction') {
        this.getNewBoardInstruction(this.board);
      } else if (this.eventType === 'BrainstormEditSubInstruction') {
        this.getNewSubInstruction(this.board);
      }
    }
    if (
      this.eventType === 'HostChangeBoardEvent' ||
      this.eventType === 'ParticipantChangeBoardEvent' ||
      this.eventType === 'BrainstormToggleMeetingMode'
    ) {
      this.getNewBoardInstruction(this.board);
      this.getNewSubInstruction(this.board);
    }
  }

  ngOnDestroy() {}

  getParticipantGroup(participantCode, participantGroups) {
    return this.brainstormService.getMyGroup(participantCode, participantGroups);
  }
  getNewBoardInstruction(board: Board) {
    this.title_instructions = board.board_activity.instructions;
  }

  getNewSubInstruction(board: Board) {
    this.sub_instructions = board.board_activity.sub_instructions;
  }

  sendSocketMessage($event) {
    this.sendMessage.emit($event);
  }

  typingStoped(type: string) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping(type);
    }, 500);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping(type: string) {
    if (!this.isHost) {
      return;
    }
    if (type === 'title') {
      this.sendMessage.emit(
        new BrainstormEditInstructionEvent(this.InstructionsElement.nativeElement.value, this.board.id)
      );
    } else if (type === 'instructions') {
      this.sendMessage.emit(
        new BrainstormEditSubInstructionEvent(this.SubInstructionsElement.nativeElement.value, this.board.id)
      );
    }
  }

  postIdea() {
    this.postIdeaEventEmitter.emit();
  }

  descriptionTextChanged($event: string) {
    if (!this.isHost) {
      return;
    }
    this.myObservable.next($event);
  }
  videoLoaded() {}
}
