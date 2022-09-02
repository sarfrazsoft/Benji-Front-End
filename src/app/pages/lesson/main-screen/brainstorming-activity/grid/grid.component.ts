import { CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';
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
import { orderBy } from 'lodash';
import * as moment from 'moment';
import Grid, { DraggerCancelEvent, DraggerEndEvent, GridOptions, Item } from 'muuri';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormLayout } from 'src/app/pages/lesson/main-screen/brainstorming-activity';
import { BrainstormService, ContextService } from 'src/app/services';
import {
  Board,
  BoardSort,
  BrainstormActivity,
  Idea,
  PostOrder,
  SetMetaDataBoardEvent,
} from 'src/app/services/backend/schema';
import { SideNavAction } from 'src/app/services/context.service';
import { PostLayoutService } from 'src/app/services/post-layout.service';
import { environment } from 'src/environments/environment';
declare var Packery: any;
declare var Draggabilly: any;



@Component({
  selector: 'benji-grid-ideas',
  templateUrl: './grid.component.html',
})
export class GridComponent extends BrainstormLayout implements OnInit, OnChanges, AfterViewInit {
  @Input() board: Board;
  @Input() act: BrainstormActivity;
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

  showItems = false;

  public layoutConfig: GridOptions = null;
  grid: Grid;

  constructor(
    private brainstormService: BrainstormService,
    private ngxPermissionsService: NgxPermissionsService,
    private postLayoutService: PostLayoutService,
    private contextService: ContextService
  ) {
    super();
    this.layoutConfig = this.postLayoutService.getLayoutConfig();
    this.layoutConfig.items = this.ideas;
    const sortDataPreset = this.postLayoutService.getSortPresetsData();
    this.layoutConfig.sortData = sortDataPreset;
  }

  ngOnInit(): void {
    this.postLayoutService.sendMessage$.subscribe((v) => {
      if (v) {
        this.sendMessage.emit(v);
      }
    });

    // this.contextService.sideNavAction$.subscribe((v: SideNavAction) => {
    //   if (v === 'closed') {
    //     this.refreshGridLayout();
    //   } else if (v === 'opened') {
    //     this.refreshGridLayout();
    //   }
    // });
  }

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.ideas = [];
      this.showItems = true;
      this.ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
      this.brainstormService.uncategorizedIdeas = this.ideas;
      this.cycle = 'second';
      this.postLayoutService.sortGrid(this.board.sort, this.grid);
    } else {
      if (
        this.eventType === 'BrainstormEditBoardInstruction' ||
        this.eventType === 'BrainstormEditSubInstruction'
      ) {
      } else if (this.eventType === 'BrainstormSubmitEvent') {
        this.brainstormService.uncategorizedAddIdea(this.board, this.ideas, () => {
          this.ideas = this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
          this.postLayoutService.sortGrid(this.board.sort, this.grid);
          this.postLayoutService.refreshGridLayout(this.grid, false);
        });
      } else if (
        this.eventType === 'BrainstormSubmitIdeaCommentEvent' ||
        this.eventType === 'BrainstormRemoveIdeaCommentEvent'
      ) {
        this.brainstormService.uncategorizedIdeaCommented(this.board, this.ideas);
        this.postLayoutService.refreshGridLayout(this.grid, false);
      } else if (
        this.eventType === 'BrainstormSubmitIdeaHeartEvent' ||
        this.eventType === 'BrainstormRemoveIdeaHeartEvent'
      ) {
        this.brainstormService.uncategorizedIdeaHearted(this.board, this.ideas, () => {});
        this.postLayoutService.sortGrid(this.board.sort, this.grid);
      } else if (
        this.eventType === 'BrainstormRemoveSubmissionEvent' ||
        this.eventType === 'BrainstormClearBoardIdeaEvent'
      ) {
        this.brainstormService.uncategorizedIdeasRemoved(this.board, this.ideas);
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.uncategorizedIdeaEdited(this.board, this.ideas);
        this.postLayoutService.refreshGridLayout(this.grid, false);
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
            this.refreshGridLayout();
          }
        }
      } else if (this.eventType === 'BrainstormBoardSortOrderEvent') {
        this.brainstormService.uncategorizedSortIdeas(this.board, this.ideas);
        this.postLayoutService.sortGrid(this.board.sort, this.grid);
      } else if (
        this.eventType === 'BrainstormAddIdeaPinEvent' ||
        this.eventType === 'BrainstormRemoveIdeaPinEvent'
      ) {
        this.brainstormService.uncategorizedUpdateIdeasPin(this.board, this.ideas);
        this.postLayoutService.sortGrid(this.board.sort, this.grid);
      } else if (this.eventType === 'BrainstormToggleParticipantNameEvent') {
        this.postLayoutService.refreshGridLayout(this.grid, false);
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
      } else if (
        this.eventType === 'BrainstormChangeBoardStatusEvent' ||
        this.eventType === 'BrainstormToggleAllowCommentEvent'
      ) {
        this.postLayoutService.refreshGridLayout(this.grid, false);
      } else if (this.eventType === 'SetMetaDataBoardEvent') {
        if (this.board.meta.updated === 'post_order') {
          this.ngxPermissionsService.hasPermission('PARTICIPANT').then((val) => {
            if (val) {
              this.postLayoutService.itemMovedByTheHost(
                this.grid,
                this.board.meta.post_order as Array<PostOrder>,
                this.board.id
              );
            }
          });
        }
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.postLayoutService.refreshGridLayout(this.grid, true);
    }, 1000);

    // refresh muuri layout after (hopefully) all iframes are loaded
    setTimeout(() => {
      this.postLayoutService.refreshGridLayout(this.grid, true);
    }, 3000);
  }

  onGridCreated(grid: Grid) {
    this.grid = grid;
    this.postLayoutService.onGridCreated(grid, this.board);
  }

  refreshGridLayout() {
    this.postLayoutService.refreshGridLayout(this.grid, false);
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
