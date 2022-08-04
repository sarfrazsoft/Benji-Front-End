import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { differenceBy, includes, orderBy, remove } from 'lodash';
import * as moment from 'moment';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { NgxPermissionsService } from 'ngx-permissions';
import * as global from 'src/app/globals';
import { BrainstormService } from 'src/app/services/activities/brainstorm.service';
import {
  Board,
  BrainstormActivity,
  BrainstormCreateCategoryEvent,
  BrainstormRemoveCategoryEvent,
  BrainstormRemoveIdeaCommentEvent,
  BrainstormRemoveIdeaHeartEvent,
  BrainstormRenameCategoryEvent,
  BrainstormSetCategoryEvent,
  BrainstormSubmitEvent,
  BrainstormSubmitIdeaCommentEvent,
  BrainstormSubmitIdeaHeartEvent,
  Category,
  Group,
  Idea,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { BaseActivityComponent } from '../../../shared/base-activity.component';

import Grid, { DraggerCancelEvent, DraggerEndEvent, GridOptions, Item } from 'muuri';
import * as Muuri from 'muuri';

@Component({
  selector: 'benji-columns-ideas',
  templateUrl: './columns.component.html',
})
export class ColumnsComponent implements OnInit, OnChanges, AfterViewInit {
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
  @ViewChild('colName') colNameElement: ElementRef;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();
  @Output() addCardUnderCategory = new EventEmitter<Category>();

  columns = [];
  cycle = 'first';
  isAdmin = false;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 16,
    horizontalOrder: false,
    initLayout: true,
  };
  masonryPrepend: boolean;

  showGrids = false;
  boardGrid: Grid;
  public colDragCounter = 0;
  boardContainer: HTMLElement = document.querySelector('.board-container');
  muuriKanbanBoard: HTMLElement = document.querySelector('.drag-container');

  public layoutConfig: GridOptions = {
    items: this.columns,
    layoutDuration: 300,
    layoutOnInit: false,
    layoutEasing: 'cubic-bezier(0.625, 0.225, 0.100, 0.890)',
    // layout: (grid, layoutId, items, width, height, callback) => {
    //   const packer = new Muuri.Packer();
    //   packer.setOptions({ horizontal: true });
    //   return packer.createLayout(grid, layoutId, items, width, height, (layoutData) => {
    //     delete layoutData.styles;
    //     callback(layoutData);
    //   });
    // },
    layout: {
      fillGaps: false,
      horizontal: false,
      alignRight: false,
      alignBottom: false,
      rounding: true,
    },
    dragEnabled: true,
    dragAxis: 'x',
    dragSortHeuristics: {
      sortInterval: 0,
    },
    dragHandle: '.board-column-title',
    dragRelease: {
      duration: 300,
      easing: 'cubic-bezier(0.625, 0.225, 0.100, 0.890)',
      useDragContainer: false,
    },
    // dragAutoScroll: {
    //   targets: [{ element: this.boardContainer, axis: Muuri.AutoScroller.AXIS_X }],
    // },
  };

  colGrids: Array<Grid> = [];
  public layoutConfigIdeas: GridOptions = {
    layoutDuration: 300,
    layoutOnInit: false,
    layoutEasing: 'cubic-bezier(0.625, 0.225, 0.100, 0.890)',
    // layout: (grid, layoutId, items, width, height, callback) => {
    //   const packer = new Muuri.Packer();
    //   packer.setOptions({ horizontal: true });
    //   return packer.createLayout(grid, layoutId, items, width, height, (layoutData) => {
    //     delete layoutData.styles;
    //     callback(layoutData);
    //   });
    // },
    layout: {
      fillGaps: false,
      horizontal: false,
      alignRight: false,
      alignBottom: false,
      rounding: true,
    },
    dragEnabled: true,
    dragSort: () => this.colGrids,
    dragContainer: this.muuriKanbanBoard,
    // dragAxis: 'y',
    // dragSortHeuristics: {
    //   sortInterval: 0,
    // },
    // dragHandle: '.board-column-title',
    dragRelease: {
      duration: 300,
      easing: 'cubic-bezier(0.625, 0.225, 0.100, 0.890)',
      useDragContainer: false,
    },
    // dragAutoScroll: {
    //   targets: [{ element: this.boardContainer, axis: Muuri.AutoScroller.AXIS_X }],
    // },
  };

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {
    if (!this.participantCode) {
    }
  }

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      console.log(this.columns);
      this.showGrids = true;
      this.cycle = 'second';
    } else {
      if (
        this.eventType === 'BrainstormEditBoardInstruction' ||
        this.eventType === 'BrainstormEditSubInstruction'
      ) {
      } else if (this.eventType === 'BrainstormSubmitEvent') {
        this.brainstormService.addIdeaToCategory(this.board, this.columns);
      } else if (this.eventType === 'BrainstormSubmitIdeaCommentEvent') {
        this.brainstormService.ideaCommented(this.board, this.columns, () => {
          this.refreshMasonryLayout();
        });
      } else if (this.eventType === 'BrainstormRemoveIdeaCommentEvent') {
        this.brainstormService.ideaCommented(this.board, this.columns, () => {
          this.refreshMasonryLayout();
        });
        this.refreshMasonryLayout();
      } else if (this.eventType === 'BrainstormSubmitIdeaHeartEvent') {
        this.brainstormService.ideaHearted(this.board, this.columns, () => {
          // this.sortAndResetMasonry();
          this.brainstormService.sortIdeas(this.board, this.columns);
        });
      } else if (this.eventType === 'BrainstormRemoveIdeaHeartEvent') {
        this.brainstormService.ideaHearted(this.board, this.columns, () => {
          this.sortAndResetMasonry();
        });
      } else if (
        this.eventType === 'BrainstormRemoveSubmissionEvent' ||
        this.eventType === 'BrainstormClearBoardIdeaEvent'
      ) {
        this.brainstormService.ideasRemoved(this.board, this.columns);
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.ideaEdited(this.board, this.columns);
        this.refreshMasonryLayout();
      } else if (this.eventType === 'BrainstormCreateCategoryEvent') {
        this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      } else if (this.eventType === 'BrainstormRemoveCategoryEvent') {
        this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      } else if (this.eventType === 'BrainstormBoardSortOrderEvent') {
        this.brainstormService.sortIdeas(this.board, this.columns);
      } else if (this.eventType === 'BrainstormSetCategoryEvent') {
        // this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
        //   if (val) {
        this.brainstormService.categoryChangedForIdea(this.board, this.columns, (existingCategories) => {
          this.columns = existingCategories;
          setTimeout(() => {
            this.brainstormService.sortIdeas(this.board, this.columns);
            setTimeout(() => {
              this.sortAndResetMasonry();
            }, 10);
          }, 10);
        });
        // } else {
        // this.brainstormService.sortIdeas(this.board, this.columns);
        // this.sortAndResetMasonry();
        //   }
        // });

        // console.log(this.eventType);
        // this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
        //   if (val) {
        // this.columns = this.brainstormService.categoryChangedForIdea(this.board, this.columns);
        // }
        // this.brainstormService.sortIdeas(this.board, this.columns);
        // this.gg();
        // this.sortAndResetMasonry();

        // this.refreshMasonryLayout();
        // });
        // this.permissionsService.hasPermission('ADMIN').then((val) => {
        //   if (val) {
        //     this.columns = this.brainstormService.categoryChangedForIdea(this.board, this.columns);
        //   }
        //   this.brainstormService.sortIdeas(this.board, this.columns);
        //   this.sortAndResetMasonry();
        // });
      } else if (
        this.eventType === 'HostChangeBoardEvent' ||
        this.eventType === 'ParticipantChangeBoardEvent'
      ) {
        if ($event.board) {
          if ($event.board.currentValue.id === $event.board.previousValue.id) {
          } else {
            this.columns = this.brainstormService.populateCategories(this.board, this.columns);
          }
        }
      } else if (
        this.eventType === 'BrainstormAddIdeaPinEvent' ||
        this.eventType === 'BrainstormRemoveIdeaPinEvent'
      ) {
        this.brainstormService.updateIdeasPin(this.board, this.columns);
        this.sortAndResetMasonry();
      } else if (this.eventType === 'BrainstormToggleParticipantNameEvent') {
        this.refreshMasonryLayout();
      } else if (this.eventType === 'BrainstormToggleMeetingMode') {
        if (this.act.meeting_mode) {
          // host just turned on meeting mode
          // take all users to new board
          this.permissionsService.hasPermission('ADMIN').then((val) => {
            if (val) {
            }
          });
          this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
            if (val) {
              this.columns = this.brainstormService.populateCategories(this.board, this.columns);
            }
          });
        } else {
          // host just turned off meeting mode.
          // do nothing
        }
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.boardGrid.refreshItems().layout(true);
    }, 1000);

    setTimeout(() => {
      console.log(this.colGrids);
      this.colGrids.forEach((grid) => {
        grid.refreshItems().layout(true);
      });
    }, 1000);
  }

  onGridCreated(grid: Grid) {
    this.boardGrid = grid;
    this.gridCreated(grid, this.board.id);
  }
  onGridCreatedIdeas(grid: Grid) {
    console.log(grid);
    this.colGrids.push(grid);
    this.gridCreated(grid, this.board.id);
  }

  gridCreated(grid: Grid, boardId: number) {
    const board_id = boardId;
    console.log('grid created');
    /**
     * Now you can do everything you want with the Grid object,
     * like subcribing to Muuri's events
     */
    grid.on('add', function (items) {
      console.log(items);
    });

    grid.on('remove', (items) => {
      console.log(items);
    });

    grid.on('dragEnd', (item: Item, event: DraggerEndEvent | DraggerCancelEvent) => {
      const colId = item.getGrid().getElement().getAttribute('columnId');
      const ideaId = item.getElement().getAttribute('ideaId');
      this.sendMessage.emit(new BrainstormSetCategoryEvent(ideaId, colId));
      // const elemGrid = item.getGrid();
      // const gridItems: Item[] = elemGrid.getItems();
      // const ideasOrder = [];
      // gridItems.forEach((itemElem: Item, i) => {
      //   const el = itemElem.getElement();
      //   ideasOrder.push({
      //     ideaId: el.getAttribute('id'),
      //     order: i.toString(),
      //   });
      // });
      // this.sendMessage$.next(
      //   new SetMetaDataBoardEvent(board_id, {
      //     updated: 'post_order',
      //     post_order: ideasOrder,
      //   })
      // );
    });
    grid.on('dragInit', () => {
      // if (!this.colDragCounter) {
      //   const width = this.boardGrid.getItems().reduce((a, item) => a + item.getWidth(), 0);
      //   this.muuriKanbanBoard.style.width = `${width}px`;
      //   this.muuriKanbanBoard.style.overflow = 'hidden';
      // }
      // ++this.colDragCounter;
    });

    grid.on('dragEnd', () => {
      // --this.colDragCounter;
    });

    grid.on('dragReleaseEnd', () => {
      // if (!this.colDragCounter) {
      //   this.muuriKanbanBoard.style.width = '';
      //   this.muuriKanbanBoard.style.overflow = '';
      // }
    });
  }

  sortAndResetMasonry() {
    // this.brainstormService.sortIdeas(this.board, this.columns);
    // for (let i = 0; i < this.masonryComponents.toArray().length; i++) {
    //   const element = this.masonryComponents.toArray()[i];
    //   element.layout();
    //   element.reloadItems();
    // }
  }

  refreshMasonryLayout() {
    // for (let i = 0; i < this.masonryComponents.toArray().length; i++) {
    //   const element = this.masonryComponents.toArray()[i];
    //   element.layout();
    // }
  }

  addCard(column: Category) {
    this.addCardUnderCategory.emit(column);
  }

  addIdea(column) {
    if (column.id) {
      column.addingIdea = true;
    }
  }

  addColumn(newCategoryNumber) {
    this.sendMessage.emit(new BrainstormCreateCategoryEvent('Category ' + newCategoryNumber, this.board.id));
  }

  deleteCol(categoryId) {
    this.sendMessage.emit(new BrainstormRemoveCategoryEvent(categoryId, true));
  }

  onColumnNameBlur(column, event) {
    let selectedCat: Category;
    this.board.brainstormcategory_set.forEach((cat: Category) => {
      if (column.id === cat.id) {
        selectedCat = cat;
      }
    });
    column.editing = false;

    if (selectedCat.category_name === event.target.value) {
      return;
    }
    column.category_name = event.target.value;
    this.sendMessage.emit(new BrainstormRenameCategoryEvent(column.id, event.target.value, this.board.id));
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

  getParticipantName(code: number) {
    let name = 'John Doe';
    this.activityState.lesson_run.participant_set.forEach((p) => {
      if (p.participant_code === code) {
        name = p.display_name;
      }
    });
    return name;
  }

  columnHeaderClicked(column) {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        column.editing = true;
        setTimeout(() => {
          this.colNameElement.nativeElement.focus();
        }, 0);
      }
    });
  }

  delete(id) {
    this.deleteIdea.emit(id);
  }

  drop(event: CdkDragDrop<Idea[]>) {
    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        if (event.previousContainer === event.container) {
          // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.sendCategorizeEvent(event);
        }
      }
    });
  }

  sendCategorizeEvent(event: CdkDragDrop<Idea[]>) {
    const categoryID = event.container.element.nativeElement.getAttribute('columnID');
    const id = event.container.data[event.currentIndex].id;
    this.sendMessage.emit(new BrainstormSetCategoryEvent(id, categoryID));
  }

  submitComment(ideaId, val) {
    this.sendMessage.emit(new BrainstormSubmitIdeaCommentEvent(val, ideaId));
  }

  removeComment(commentId, ideaId) {
    this.sendMessage.emit(new BrainstormRemoveIdeaCommentEvent(commentId, ideaId));
  }

  isUserTheCommentor(participantCode) {
    if (this.participantCode && this.participantCode === participantCode) {
      return true;
    }
    return false;
  }

  isHearted(item) {
    let hearted = false;
    item.hearts.forEach((element) => {
      if (element.participant === this.participantCode) {
        hearted = true;
      }
    });
    return hearted;
  }

  removeHeart(item) {
    let hearted;
    item.hearts.forEach((element) => {
      if (element.participant === this.participantCode) {
        hearted = element;
      }
    });
    this.sendMessage.emit(new BrainstormRemoveIdeaHeartEvent(item.id, hearted.id));
  }

  setHeart(ideaId) {
    this.sendMessage.emit(new BrainstormSubmitIdeaHeartEvent(ideaId));
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
