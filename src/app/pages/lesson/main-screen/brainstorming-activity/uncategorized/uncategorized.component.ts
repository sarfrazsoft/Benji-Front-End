import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep, differenceBy, find, findIndex, includes, remove } from 'lodash';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { NgxPermissionsService } from 'ngx-permissions';
import * as global from 'src/app/globals';
import { BrainstormService } from 'src/app/services';
import {
  Board,
  BrainstormActivity,
  BrainstormSubmitEvent,
  Category,
  Idea,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-uncategorized-ideas',
  templateUrl: './uncategorized.component.html',
})
export class UncategorizedComponent implements OnInit, OnChanges {
  @Input() board: Board;
  @Input() act: BrainstormActivity;
  @Input() activityState;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
  @Input() showUserName;
  @Input() participantCode;
  @Input() eventType;
  @Input() categorizeFlag;
  @Input() myGroup;

  ideas = [];
  cycle = 'first';

  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();

  public masonryOptions: NgxMasonryOptions = {
    gutter: 16,
    horizontalOrder: true,
    initLayout: true,
  };

  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  masonryPrepend: boolean;

  constructor(
    private brainstormService: BrainstormService,
    private ngxPermissionService: NgxPermissionsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.ideas = [];
      this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
      this.brainstormService.uncategorizedIdeas = this.ideas;
      this.cycle = 'second';
    } else {
      if (
        this.eventType === 'BrainstormEditBoardInstruction' ||
        this.eventType === 'BrainstormEditSubInstruction'
      ) {
      } else if (this.eventType === 'BrainstormSubmitEvent') {
        if (this.board.sort === 'newest_to_oldest') {
          this.masonryPrepend = true;
        } else {
          this.masonryPrepend = false;
        }
        this.brainstormService.uncategorizedAddIdea(this.board, this.ideas, () => {
          setTimeout(() => {
            // this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
            // this.masonry?.reloadItems();
            this.masonry?.layout();
          }, 50);
        });
      } else if (
        this.eventType === 'BrainstormSubmitIdeaCommentEvent' ||
        this.eventType === 'BrainstormRemoveIdeaCommentEvent'
      ) {
        this.brainstormService.uncategorizedIdeaCommented(this.board, this.ideas);
        this.refreshMasonryLayout();
      } else if (
        this.eventType === 'BrainstormSubmitIdeaHeartEvent' ||
        this.eventType === 'BrainstormRemoveIdeaHeartEvent'
      ) {
        this.brainstormService.uncategorizedIdeaHearted(this.board, this.ideas, () => {});
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        this.masonry?.layout();
        this.masonry?.reloadItems();
      } else if (
        this.eventType === 'BrainstormRemoveSubmissionEvent' ||
        this.eventType === 'BrainstormClearBoardIdeaEvent'
      ) {
        this.brainstormService.uncategorizedIdeasRemoved(this.board, this.ideas);
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.uncategorizedIdeaEdited(this.board, this.ideas);
        this.refreshMasonryLayout();
      } else if (
        this.eventType === 'HostChangeBoardEvent' ||
        this.eventType === 'ParticipantChangeBoardEvent'
      ) {
        if ($event.board) {
          if ($event.board.currentValue.id === $event.board.previousValue.id) {
          } else {
            this.ideas = [];
            this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
            this.brainstormService.uncategorizedIdeas = this.ideas;
          }
        }
      } else if (this.eventType === 'BrainstormBoardSortOrderEvent') {
        this.masonry?.reloadItems();
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        this.masonry?.layout();
      } else if (
        this.eventType === 'BrainstormAddIdeaPinEvent' ||
        this.eventType === 'BrainstormRemoveIdeaPinEvent'
      ) {
        this.brainstormService.uncategorizedUpdateIdeasPin(this.board, this.ideas);
        this.masonry?.reloadItems();
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        this.masonry?.layout();
      } else if (this.eventType === 'BrainstormToggleParticipantNameEvent') {
        this.refreshMasonryLayout();
      } else if (this.eventType === 'BrainstormToggleMeetingMode') {
        if (this.act.meeting_mode) {
          // host just turned on meeting mode
          // take all users to new board
          this.ngxPermissionService.hasPermission('ADMIN').then((val) => {
            if (val) {
            }
          });
          this.ngxPermissionService.hasPermission('PARTICIPANT').then((val) => {
            if (val) {
              this.ideas = [];
              this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
              this.brainstormService.uncategorizedIdeas = this.ideas;
            }
          });
        } else {
          // host just turned off meeting mode.
          // do nothing
        }
      }
    }
  }

  resetMasonry() {
    if (this.masonry) {
      this.masonry.reloadItems();
      this.masonry.layout();
    }
  }

  refreshMasonryLayout() {
    if (this.masonry) {
      this.masonry.layout();
    }
  }

  isAbsolutePath(imageUrl: string) {
    if (imageUrl.includes('https:')) {
      return true;
    } else {
      return false;
    }
  }

  openImage(imageUrl: string) {
    this.viewImage.emit(imageUrl);
  }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  delete(id) {
    this.deleteIdea.emit(id);
  }
}
