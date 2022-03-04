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
import * as global from 'src/app/globals';
import { BrainstormService } from 'src/app/services';
import {
  Board,
  BrainstormActivity,
  BrainstormSubmitEvent,
  Category,
  Idea,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
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

  constructor(private brainstormService: BrainstormService) {}

  ngOnInit(): void {}

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.ideas = [];
      this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
      this.brainstormService.uncategorizedIdeas = this.ideas;
      this.cycle = 'second';
      this.resetMasonry();
    } else {
      if (this.eventType === 'BrainstormSubmitEvent') {
        this.brainstormService.uncategorizedAddIdea(this.board, this.ideas);
        // this.resetMasonry();
      } else if (
        this.eventType === 'BrainstormSubmitIdeaCommentEvent' ||
        this.eventType === 'BrainstormRemoveIdeaCommentEvent'
      ) {
        this.brainstormService.uncategorizedIdeaCommented(this.board, this.ideas);
      } else if (
        this.eventType === 'BrainstormSubmitIdeaHeartEvent' ||
        this.eventType === 'BrainstormRemoveIdeaHeartEvent'
      ) {
        this.brainstormService.uncategorizedIdeaHearted(this.board, this.ideas, () => {});
      } else if (
        this.eventType === 'BrainstormRemoveSubmissionEvent' ||
        this.eventType === 'BrainstormClearBoardIdeaEvent'
      ) {
        this.brainstormService.uncategorizedIdeasRemoved(this.board, this.ideas);
        // this.resetMasonry();
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.uncategorizedIdeaEdited(this.board, this.ideas);
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
      }
    }
    // this.masonryPrepend = this.board.sort === 'newest_to_oldest' ? true : null;

    //
    // only adding an idea is broken now. when we add an idea it is adding to the end
    // when newest to oldest is selected
    // 1 - try reloadItems
    // 2 - try prepend
    // 3- try reload and prepend
    this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
    // console.log(this.ideas);
    // if (this.masonryPrepend) {
    // if (this.eventType === 'BrainstormBoardSortOrderEvent') {
    //   this.masonry.reloadItems();
    // }
    this.resetMasonry();
    // }
  }

  resetMasonry() {
    if (this.masonry) {
      this.masonry.reloadItems();
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
