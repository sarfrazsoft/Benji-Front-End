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
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { NgxPermissionsService } from 'ngx-permissions';
import { BrainstormService } from 'src/app/services';
import {
  Board,
  BoardSort,
  BrainstormActivity,
  Idea,
  SetMetaDataBoardEvent,
} from 'src/app/services/backend/schema';
import { PostLayoutService } from 'src/app/services/post-layout.service';
import { environment } from 'src/environments/environment';
declare var Packery: any;
declare var Draggabilly: any;

export interface PostOrder {
  ideaId: string;
  order: string;
}

@Component({
  selector: 'benji-grid-ideas',
  templateUrl: './grid.component.html',
})
export class GridComponent implements OnInit, OnChanges, AfterViewInit {
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

  // Add any options you'd like to set here
  public layoutConfig: GridOptions = {
    items: this.ideas,
    layoutOnInit: false,
    dragEnabled: true,
    layout: {
      fillGaps: false,
      horizontal: false,
      alignRight: false,
      alignBottom: false,
      rounding: true,
    },
  };

  grid: Grid;

  constructor(
    private brainstormService: BrainstormService,
    private ngxPermissionService: NgxPermissionsService,
    private postLayoutService: PostLayoutService
  ) {
    const sortDataPreset = this.postLayoutService.getSortPresetsData();
    this.layoutConfig.sortData = sortDataPreset;
  }

  ngOnInit(): void {}

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.ideas = [];
      this.showItems = true;
      // const ideas = this.brainstormService.uncategorizedPopulateIdeas(this.board);
      // const sortedIdeas = this.sortOnOrder(ideas, this.ideasSetOrder);
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
      } else if (
        this.eventType === 'BrainstormChangeBoardStatusEvent' ||
        this.eventType === 'BrainstormToggleAllowCommentEvent'
      ) {
        this.postLayoutService.refreshGridLayout(this.grid, false);
      } else if (this.eventType === 'SetMetaDataBoardEvent') {
        this.ngxPermissionService.hasPermission('PARTICIPANT').then((val) => {
          if (val) {
            if (this.board.meta.updated === 'post_order') {
              const unsortedGridItems = this.grid.getItems();
              const sortOrder: Array<PostOrder> = this.board.meta.post_order;
              console.log(unsortedGridItems, sortOrder);
              const sortedArray = [];
              sortOrder.forEach((orderItem) => {
                unsortedGridItems.forEach((item) => {
                  if (orderItem.ideaId === item.getElement().getAttribute('id')) {
                    sortedArray.push(item);
                  }
                });
              });
              this.grid.sort(sortedArray);
            }
          }
        });
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.grid.refreshItems().layout(true);
    }, 1000);
  }

  onGridCreated(grid: Grid) {
    this.grid = grid;
    console.log('grid created');
    /**
     * Now you can do everything you want with the Grid object,
     * like subcribing to Muuri's events
     */
    grid.on('add', function (items) {
      // console.log(items);
    });

    grid.on('remove', (items) => {
      console.log(items);
    });

    grid.on('dragEnd', (item: Item, event: DraggerEndEvent | DraggerCancelEvent) => {
      const gridItems: Item[] = this.grid.getItems();
      const ideasOrder = [];
      gridItems.forEach((itemElem: Item, i) => {
        const el = itemElem.getElement();
        ideasOrder.push({
          ideaId: el.getAttribute('id'),
          order: i.toString(),
        });
      });
      this.sendMessage.emit(
        new SetMetaDataBoardEvent(this.board.id, {
          updated: 'post_order',
          post_order: ideasOrder,
        })
      );
    });
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
