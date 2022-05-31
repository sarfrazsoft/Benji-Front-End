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
  BrainstormActivity,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { TopicMediaService } from 'src/app/services/topic-media.service';

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
  @Input() boardStatus;

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
    private topicMediaService: TopicMediaService
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

    this.onChanges();

    this.getBoardInstructions();

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

  isPostingAllowed() {
    if (this.isHost) {
      // if it's a host allow posting without any consideration
      // to board status
      return true;
    } else if (this.boardStatus === 'open') {
      // is participant
      return true;
    } else {
      return false;
    }
  }

  getBoardInstructions() {
    this.brainstormService.boardTitle$.subscribe((title: string) => {
      if (title) {
        this.title_instructions = title;
      }
    });
    this.brainstormService.boardInstructions$.subscribe((instructions: string) => {
      if (instructions) {
        this.sub_instructions = instructions;
      }
    });
  }

  ngOnChanges() {
    this.onChanges();
  }

  onChanges() {
    this.act = cloneDeep(this.activityState.brainstormactivity);
    if (
      this.eventType === 'BrainstormEditBoardInstruction' ||
      this.eventType === 'BrainstormEditSubInstruction'
    ) {
      this.getBoardInstructions();
    } else {
      this.getBoardInstructions();
    }
  }

  ngOnDestroy() {}

  getParticipantGroup(participantCode, participantGroups) {
    return this.brainstormService.getMyGroup(participantCode, participantGroups);
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
    this.myObservable.next($event);
  }
  videoLoaded() {}
}
