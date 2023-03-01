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
import { cloneDeep, differenceBy, find, includes, orderBy, parseInt, remove } from 'lodash';
import * as moment from 'moment';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { NgxPermissionsService } from 'ngx-permissions';
import * as global from 'src/app/globals';
import { BrainstormLayout } from 'src/app/pages/lesson/main-screen/brainstorming-activity';
import { BrainstormEventService, PostLayoutService } from 'src/app/services';
import { BrainstormService } from 'src/app/services/activities/brainstorm.service';
import { getItemFromList } from 'src/app/services/activities/item-list-functions/get-item-from-list/get-item-from-list';
import { insertAt } from 'src/app/services/activities/idea-list-functions/insert-at/insert-at';
import { moveItem } from 'src/app/services/activities/item-list-functions/move-item-in-list/move-item-in-list';
import { removeItemFromList } from 'src/app/services/activities/item-list-functions/remove-item-from-category/remove-item-from-category';
import {
  Board,
  BrainstormActivity,
  BrainstormIdeaRearrangeEvent,
  BrainstormRemoveIdeaCommentEvent,
  BrainstormRemoveIdeaHeartEvent,
  BrainstormSetCategoryEvent,
  BrainstormSetCategoryResponse,
  BrainstormSubmitIdeaCommentEvent,
  BrainstormSubmitIdeaCommentResponse,
  BrainstormSubmitIdeaHeartEvent,
  Category,
  ColsCategoryChangeIdeaOrderInfo,
  ColsIdeaOrderInfo,
  EventTypes,
  Group,
  Idea,
  SetMetaDataBoardEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import {
  BrainstormCategoryRearrangeEvent,
  BrainstormCreateCategoryEvent,
  BrainstormRemoveCategoryEvent,
  BrainstormRenameCategoryEvent,
} from 'src/app/services/backend/schema/messages/category-events';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { BaseActivityComponent } from '../../../shared/base-activity.component';

@Component({
  selector: 'benji-categorized-ideas',
  templateUrl: './categorized.component.html',
})
export class CategorizedComponent extends BrainstormLayout implements OnInit, OnChanges {
  @Input() board: Board;
  @Input() act: BrainstormActivity;
  @Input() activityState;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
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
  secondRunAllowed = true;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 16,
    horizontalOrder: false,
    initLayout: true,
  };

  // @ViewChildren(NgxMasonryComponent) masonryComponents: QueryList<NgxMasonryComponent>;
  masonryPrepend: boolean;
  columnSize: string;

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService,
    private brainstormEventService: BrainstormEventService,
    private postLayoutService: PostLayoutService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.board.post_size) {
      this.columnSize = this.board.post_size;
    }

    // this.brainstormEventService.categoryChangedForIdea$.subscribe((v: BrainstormSetCategoryResponse) => {
    //   // Add the comment to the card
    //   if (this.board.id === v.board) {
    //     // the comment was added in the board
    //     // console.log(v);

    //     let idea: Idea;
    //     for (let j = 0; j < this.columns.length; j++) {
    //       const categoryIdeas = this.columns[j].brainstormidea_set.filter((r) => !r.removed);
    //       const tempIdea = find(categoryIdeas, { id: v.brainstormidea_id });
    //       if (tempIdea) {
    //         idea = tempIdea;
    //         console.log(cloneDeep(this.board.brainstormcategory_set[j].brainstormidea_set));
    //         console.log(tempIdea);
    //         this.board.brainstormcategory_set[j].brainstormidea_set = removeItemFromList(
    //           this.board.brainstormcategory_set[j].brainstormidea_set,
    //           tempIdea.id
    //         );
    //         console.log(cloneDeep(this.board.brainstormcategory_set[j].brainstormidea_set));
    //         break;
    //       }
    //     }

    //     if (idea) {
    //       idea.next_idea = v.next_idea;
    //       idea.previous_idea = v.previous_idea;
    //       for (let j = 0; j < this.columns.length; j++) {
    //         if (this.columns[j].id === v.category) {
    //           const tempIdea = find(this.columns[j].brainstormidea_set, { id: idea.id });

    //           if (!tempIdea) {
    //             console.log(cloneDeep(this.columns[j].brainstormidea_set));
    //             this.columns[j].brainstormidea_set = pushIdeaIntoCategory(
    //               this.columns[j].brainstormidea_set,
    //               idea
    //             );
    //             console.log(cloneDeep(this.columns[j].brainstormidea_set));
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
  }

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      console.log(cloneDeep(this.columns));
      this.cycle = 'second';
    } else {
      if (
        this.eventType === 'BrainstormEditBoardInstruction' ||
        this.eventType === 'BrainstormEditSubInstruction'
      ) {
      } else if (this.eventType === 'BrainstormSubmitEvent') {
        console.log(this.board);
        this.brainstormService.addIdeaToCategory(this.board, this.columns);
      } else if (this.eventType === EventTypes.brainstormBoardPostSizeEvent) {
        this.updateColumnSize(this.board);
      } else if (this.eventType === EventTypes.brainstormIdeaRearrangeEvent) {
      } else if (this.eventType === 'BrainstormSubmitIdeaCommentEvent') {
        this.brainstormService.ideaCommented(this.board, this.columns, () => {
          // this.refreshMasonryLayout();
        });
      } else if (this.eventType === 'BrainstormRemoveIdeaCommentEvent') {
        this.brainstormService.ideaCommented(this.board, this.columns, () => {
          this.refreshMasonryLayout();
        });
        this.refreshMasonryLayout();
      } else if (this.eventType === 'BrainstormSubmitIdeaHeartEvent') {
        this.brainstormService.ideaHearted(this.board, this.columns, () => {
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
        // console.log('columns');
        // console.log(this.columns);
        // console.log(this.board.brainstormcategory_set, this.columns);
        this.columns = this.brainstormService.populateCategories(this.board, this.columns);
        // this.brainstormService.categoryChangedForIdea(this.board, this.columns, () => {});
        // this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      } else if (
        this.eventType === EventTypes.hostChangeBoardEvent ||
        this.eventType === EventTypes.participantChangeBoardEvent
      ) {
        if ($event.board) {
          if ($event.board.currentValue.id === $event.board.previousValue.id) {
          } else {
            this.columns = this.brainstormService.populateCategories(this.board, this.columns);
            this.updateColumnSize(this.board);
          }
        }
      } else if (
        this.eventType === 'BrainstormAddIdeaPinEvent' ||
        this.eventType === 'BrainstormRemoveIdeaPinEvent'
      ) {
        this.brainstormService.updateIdeasPin(this.board, this.columns, () => {
          this.brainstormService.sortIdeas(this.board, this.columns);
        });
      } else if (this.eventType === EventTypes.brainstormToggleParticipantNameEvent) {
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
      } else if (this.eventType === 'SetMetaDataBoardEvent') {
      }
    }
  }

  updateColumnSize(board: Board) {
    this.columnSize = board.post_size;
  }

  sortAndResetMasonry() {}

  refreshMasonryLayout() {}

  addCard(column: Category) {
    this.addCardUnderCategory.emit(column);
  }

  addIdea(column) {
    if (column.id) {
      column.addingIdea = true;
    }
  }

  addColumn(newCategoryNumber) {
    const lastCategory = getItemFromList(this.columns, 'last', 'previous_category', 'next_category');

    let lastCategoryId = null;
    if (lastCategory) {
      lastCategoryId = lastCategory.id;
    }
    this.sendMessage.emit(
      new BrainstormCreateCategoryEvent('Category ' + newCategoryNumber, this.board.id, lastCategoryId)
    );
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
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      if (this.board.sort !== 'unsorted') {
        const sortOption = global.PostOrderOptions.find((v) => v.value === this.board.sort);
        const sortOptionName = sortOption ? sortOption.name : 'Unknown';

        this.utilsService.openWarningNotification(`The board sort mode is set to ${sortOptionName}`, '');
        return;
      }
      this.sendRearrangeEvent(event);
    } else {
      this.sendCategorizeEvent(event);
    }
  }

  columnDropped(event: CdkDragDrop<Category[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const movedCategory = moveItem(
      cloneDeep(event.container.data),
      event.previousIndex,
      event.currentIndex,
      'previous_category',
      'next_category'
    );
    console.log(movedCategory);
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.sendMessage.emit(
      new BrainstormCategoryRearrangeEvent(
        movedCategory.id,
        movedCategory.previous_category,
        movedCategory.next_category
      )
    );
  }

  sendCategorizeEvent(event: CdkDragDrop<Idea[]>) {
    const movedIdeaInOriginalState = event.previousContainer.data[event.previousIndex];
    const categoryId = parseInt(event.container.element.nativeElement.getAttribute('columnID'), 10);
    // if ideas are legacy
    const allIdeasAreLegacy = event.container.data.every(
      (idea) => idea.next_idea === null && idea.previous_idea === null
    );
    if (allIdeasAreLegacy && event.container.data?.length > 1) {
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
      this.sendMessage.emit(
        new BrainstormSetCategoryEvent({
          id: movedIdeaInOriginalState.id,
          category: categoryId,
          next_idea: null,
          previous_idea: null,
        })
      );
    } else {
      // if ideas are not legacy
      // at least one idea has next_idea or previous_idea set
      // console.log(`verify if this previousindex is from previous container ${event.previousIndex}`); yes
      // console.log(`verify if this current index is from new container ${event.currentIndex}`); yes
      // const movedIdea = moveIdea(cloneDeep(event.container.data), event.previousIndex, event.currentIndex);

      // remove idea from category
      // console.log(cloneDeep(event.previousContainer.data));

      // for (let j = 0; j < this.columns.length; j++) {
      //   const col = this.columns[j];
      //   if (col.id === categoryId) {
      //     col.brainstormidea_set = removeItemFromList(
      //       event.previousContainer.data,
      //       movedIdeaInOriginalState.id
      //     );
      //     event.previousContainer.data = col.brainstormidea_set;
      //   }
      // }
      event.previousContainer.data = removeItemFromList(
        event.previousContainer.data,
        movedIdeaInOriginalState.id,
        'previous_idea',
        'next_idea'
      );
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
      // removeItemFromList(event.previousContainer.data, movedIdeaInOriginalState.id);
      // event.previousContainer.data

      // console.log(cloneDeep(event.previousContainer.data));

      // insert idea into new category using index
      // use the returned next_idea and previouse_idea to send BE event
      // const movedIdea = insertAt(event.container.data, movedIdeaInOriginalState, event.currentIndex);
      const movedIdea = insertAt(
        event.container.data,
        cloneDeep(movedIdeaInOriginalState),
        event.currentIndex
      );

      // after that check how to handle the response from the event
      const i = {
        id: movedIdeaInOriginalState.id,
        category: categoryId,
        previous_idea: movedIdea.previous_idea,
        next_idea: movedIdea.next_idea,
      };
      this.sendMessage.emit(new BrainstormSetCategoryEvent(i));
    }
  }

  sendRearrangeEvent(event: CdkDragDrop<Idea[]>) {
    const movedIdea = moveItem(
      cloneDeep(event.container.data),
      event.previousIndex,
      event.currentIndex,
      'previous_idea',
      'next_idea'
    );
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.sendMessage.emit(
      new BrainstormIdeaRearrangeEvent(movedIdea.id, movedIdea.previous_idea, movedIdea.next_idea)
    );
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
