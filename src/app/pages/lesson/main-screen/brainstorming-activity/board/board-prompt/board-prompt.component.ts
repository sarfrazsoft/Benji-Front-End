import { HttpClient } from '@angular/common/http';
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
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  ActivitySettingsService,
  BrainstormService,
  ContextService,
  SharingToolService,
} from 'src/app/services';
import {
  Board,
  BoardMode,
  BrainstormActivity,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';

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

  hasMedia = true;
  private typingTimer;
  myObservable = new Subject<string>();

  @Output() sendMessage = new EventEmitter<any>();
  @Output() postIdeaEventEmitter = new EventEmitter<any>();

  constructor(
    private contextService: ContextService,
    private matDialog: MatDialog,
    private utilsService: UtilsService,
    private activitySettingsService: ActivitySettingsService,
    private httpClient: HttpClient,
    private permissionsService: NgxPermissionsService,
    private sharingToolService: SharingToolService,
    private brainstormService: BrainstormService,
    private boardStatusService: BoardStatusService
  ) {}

  ngOnInit() {
    // super.ngOnInit();
    this.act = this.activityState.brainstormactivity;

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
    const act = this.activityState.brainstormactivity;
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
}
