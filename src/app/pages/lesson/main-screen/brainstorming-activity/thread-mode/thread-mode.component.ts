import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { differenceBy, find, findIndex, includes, remove } from 'lodash';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { NgxPermissionsService } from 'ngx-permissions';
import * as global from 'src/app/globals';
import { fadeAnimation, listAnimation } from 'src/app/pages/lesson/main-screen/shared/app.animations';
import { BrainstormService } from 'src/app/services';
import { Board, BrainstormSubmitEvent, Category, Idea } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-thread-mode-ideas',
  templateUrl: './thread-mode.component.html',
  // animations: [fadeAnimation, listAnimation],
  animations: [
    trigger('anim', [
      transition('* => void', [
        style({
          height: '*',
          opacity: '1',
          transform: 'translateY(0)',
          'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
        }),
        sequence([
          animate(
            '.9s ease',
            style({
              height: '*',
              opacity: '.2',
              transform: 'translateY(20px)',
              'box-shadow': 'none',
            })
          ),
          animate(
            '.9s ease',
            style({
              height: '0',
              opacity: 0,
              transform: 'translateX(20px)',
              'box-shadow': 'none',
            })
          ),
        ]),
      ]),
      transition('void => active', [
        style({
          height: '0',
          opacity: '0',
          transform: 'translateY(20px)',
          'box-shadow': 'none',
        }),
        sequence([
          animate(
            '.9s ease',
            style({
              height: '*',
              opacity: '.2',
              transform: 'translateY(20px)',
              'box-shadow': 'none',
            })
          ),
          animate(
            '.9s ease',
            style({
              height: '*',
              opacity: 1,
              transform: 'translateX(0)',
              'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
            })
          ),
        ]),
      ]),
    ]),
  ],
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
  @Input() isColumnsLayout;
  @Input() myGroup;
  @Input() isHost;

  ideas = [];
  cycle = 'first';

  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private brainstormService: BrainstormService,
    private ngxPermissionsService: NgxPermissionsService
  ) {}

  public masonryOptions: NgxMasonryOptions = {
    gutter: 16,
    horizontalOrder: false,
    initLayout: true,
  };

  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  masonryPrepend: boolean;

  ngOnInit(): void {}

  ngAfterViewInit() {}

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
          this.ideas = this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
          setTimeout(() => {
            this.resetMasonry();
          }, 50);
        });
      } else if (
        this.eventType === 'BrainstormSubmitIdeaCommentEvent' ||
        this.eventType === 'BrainstormRemoveIdeaCommentEvent'
      ) {
        this.brainstormService.uncategorizedIdeaCommented(this.board, this.ideas);
        this.masonry?.layout();
      } else if (
        this.eventType === 'BrainstormSubmitIdeaHeartEvent' ||
        this.eventType === 'BrainstormRemoveIdeaHeartEvent'
      ) {
        this.brainstormService.uncategorizedIdeaHearted(this.board, this.ideas, (val) => {});
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        this.masonry?.layout();
        this.masonry?.reloadItems();
      } else if (
        this.eventType === 'BrainstormRemoveSubmissionEvent' ||
        this.eventType === 'BrainstormClearBoardIdeaEvent'
      ) {
        this.brainstormService.uncategorizedIdeasRemoved(this.board, this.ideas);
        this.masonry?.layout();
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.uncategorizedIdeaEdited(this.board, this.ideas);
        this.masonry?.layout();
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
          this.ngxPermissionsService.hasPermission('ADMIN').then((val) => {
            if (val) {
            }
          });
          this.ngxPermissionsService.hasPermission('PARTICIPANT').then((val) => {
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

  refreshMasonryLayout() {
    if (this.masonry) {
      this.masonry.layout();
    }
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

  getUserRole(item: Idea) {
    const obj = this.brainstormService.getUserRole(this.participantCode, item, this.board.status);
    return obj.userRole;
  }

  canViewIdea(idea: Idea) {
    const userRole = this.getUserRole(idea);
    return this.brainstormService.canViewIdea(this.board.status, userRole, this.isHost);
  }
}
