import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Isotope from 'isotope-layout';
import { differenceBy, find, findIndex, includes, remove } from 'lodash';
import * as global from 'src/app/globals';
import { BrainstormService } from 'src/app/services';
import { Board, BrainstormSubmitEvent, Category, Idea } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
import { environment } from 'src/environments/environment';
// declare var Isotope: any;
@Component({
  selector: 'benji-thread-mode-ideas',
  templateUrl: './thread-mode.component.html',
})
export class ThreadModeComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() board: Board;
  @Input() act;
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

  isotope: Isotope;

  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private brainstormService: BrainstormService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // const elem: HTMLElement = document.querySelector('.ideas-list-container');
    // this.isotope = new Isotope(elem, {
    //   // options
    //   itemSelector: '.brainstorm-idea-li',
    //   layoutMode: 'vertical',
    //   sortAscending: false,
    //   getSortData: {
    //     category: '[data-likes]',
    //   },
    // });
    // data-likes
    // var iso = new Isotope( elem, {
    //   // options
    //   itemSelector: '.grid-item',
    //   layoutMode: 'fitRows'
    // });
  }

  meow() {
    // this.isotope({ sortBy: 'category' });
    this.isotope.arrange({ sortBy: 'category' });
    // this.isotope.reloadItems();
  }

  noMeow() {}

  ngOnChanges() {
    if (
      this.cycle === 'first' ||
      this.eventType === 'filtered' ||
      this.eventType === 'HostChangeBoardEvent' ||
      this.eventType === 'ParticipantChangeBoardEvent'
    ) {
      this.ideas = [];
      this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
      this.brainstormService.uncategorizedIdeas = this.ideas;
      this.cycle = 'second';
    } else {
      if (this.eventType === 'BrainstormSubmitEvent') {
        this.brainstormService.uncategorizedAddIdea(this.board, this.ideas);
      } else if (
        this.eventType === 'BrainstormSubmitIdeaCommentEvent' ||
        this.eventType === 'BrainstormRemoveIdeaCommentEvent'
      ) {
        this.brainstormService.uncategorizedIdeaCommented(this.board, this.ideas);
      } else if (
        this.eventType === 'BrainstormSubmitIdeaHeartEvent' ||
        this.eventType === 'BrainstormRemoveIdeaHeartEvent'
      ) {
        this.brainstormService.uncategorizedIdeaHearted(this.board, this.ideas);
      } else if (
        this.eventType === 'BrainstormRemoveSubmissionEvent' ||
        this.eventType === 'BrainstormClearBoardIdeaEvent'
      ) {
        this.brainstormService.uncategorizedIdeasRemoved(this.board, this.ideas);
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.uncategorizedIdeaEdited(this.board, this.ideas);
      }
    }
    this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
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
