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
  @Input() categorizeFlag;
  @Input() myGroup;
  @ViewChild('colName') colNameElement: ElementRef;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();
  @Output() addCardUnderCategory = new EventEmitter<Category>();

  columns = [];
  cycle = 'first';

  public masonryOptions: NgxMasonryOptions = {
    gutter: 16,
    horizontalOrder: false,
    initLayout: true,
  };

  @ViewChildren(NgxMasonryComponent) masonryComponents: QueryList<NgxMasonryComponent>;
  masonryPrepend: boolean;

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges($event: SimpleChanges) {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      this.cycle = 'second';
    } else {
      if (this.eventType === 'BrainstormSubmitEvent') {
        this.brainstormService.addIdeaToCategory(this.board, this.columns);
      } else if (this.eventType === 'BrainstormSubmitIdeaCommentEvent') {
        this.brainstormService.ideaCommented(this.board, this.columns);
      } else if (this.eventType === 'BrainstormRemoveIdeaCommentEvent') {
        this.brainstormService.ideaCommented(this.board, this.columns);
      } else if (this.eventType === 'BrainstormSubmitIdeaHeartEvent') {
        this.brainstormService.ideaHearted(this.board, this.columns, () => {
          this.sortAndResetMasonry();
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
      } else if (this.eventType === 'BrainstormCreateCategoryEvent') {
        this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      } else if (this.eventType === 'BrainstormRemoveCategoryEvent') {
        this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      } else if (this.eventType === 'BrainstormBoardSortOrderEvent') {
        this.brainstormService.sortIdeas(this.board, this.columns);
      } else if (this.eventType === 'BrainstormSetCategoryEvent') {
        this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
          if (val) {
            this.columns = this.brainstormService.categoryChangedForIdea(this.board, this.columns);
          }
          this.brainstormService.sortIdeas(this.board, this.columns);
          this.sortAndResetMasonry();
        });
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
      }
    }
  }

  sortAndResetMasonry() {
    this.brainstormService.sortIdeas(this.board, this.columns);
    for (let i = 0; i < this.masonryComponents.toArray().length; i++) {
      const element = this.masonryComponents.toArray()[i];
      element.layout();
      element.reloadItems();
    }
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
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
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
}
