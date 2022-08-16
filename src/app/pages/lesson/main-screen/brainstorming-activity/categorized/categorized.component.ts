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
  SetMetaDataBoardEvent,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { BaseActivityComponent } from '../../../shared/base-activity.component';
import { PostOrder } from '../grid/grid.component';

export interface ColsIdeaOrderInfo {
  container: string;
  previousIndex: number;
  currentIndex: number;
}

@Component({
  selector: 'benji-categorized-ideas',
  templateUrl: './categorized.component.html',
})
export class CategorizedComponent implements OnInit, OnChanges {
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
  secondRunAllowed = true;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 16,
    horizontalOrder: false,
    initLayout: true,
  };

  // @ViewChildren(NgxMasonryComponent) masonryComponents: QueryList<NgxMasonryComponent>;
  masonryPrepend: boolean;

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
      this.cycle = 'second';
    } else {
      if (
        this.eventType === 'BrainstormEditBoardInstruction' ||
        this.eventType === 'BrainstormEditSubInstruction'
      ) {
      } else if (this.eventType === 'BrainstormSubmitEvent') {
        this.brainstormService.addIdeaToCategory(this.board, this.columns, (changedCategory: Category) => {
          console.log(changedCategory);
        });
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
      } else if (this.eventType === 'SetMetaDataBoardEvent' && this.secondRunAllowed) {
        if (this.board.meta.updated === 'post_order') {
          this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
            if (val) {
              const colsIdeaOrderInfo: ColsIdeaOrderInfo = this.board.meta.post_order;
              this.columns.forEach((column: Category) => {
                if (column.id.toString() === colsIdeaOrderInfo.container) {
                  console.log(column);
                  moveItemInArray(
                    column.brainstormidea_set,
                    colsIdeaOrderInfo.previousIndex,
                    colsIdeaOrderInfo.currentIndex
                  );
                  console.log(column);
                  this.secondRunAllowed = false;
                  setTimeout(() => {
                    this.secondRunAllowed = true;
                  }, 1000);
                }
              });
              // this.postLayoutService.itemMovedByTheHost(
              //   this.grid,
              //   this.board.meta.post_order as Array<PostOrder>
              // );
            }
          });
        }
      }
    }
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
          // if (event.previousIndex === event.currentIndex) {
          //   return;
          // }
          // const category = event.container.element.nativeElement.getAttribute('columnId');
          // const ideasOrder: ColsIdeaOrderInfo = {
          //   container: category,
          //   previousIndex: event.previousIndex,
          //   currentIndex: event.currentIndex,
          // };
          // this.sendMessage.emit(
          //   new SetMetaDataBoardEvent(this.board.id, {
          //     updated: 'post_order',
          //     post_order: ideasOrder,
          //   })
          // );
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
    const ideaID = event.item.element.nativeElement.getAttribute('ideaId');
    this.sendMessage.emit(new BrainstormSetCategoryEvent(ideaID, categoryID));
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
