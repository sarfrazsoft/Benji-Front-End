import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { differenceBy, includes, remove } from 'lodash';
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
  @Input() submissionScreen;
  @Input() voteScreen;
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

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private brainstormService: BrainstormService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
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
        this.brainstormService.ideaHearted(this.board, this.columns);
      } else if (this.eventType === 'BrainstormRemoveIdeaHeartEvent') {
        this.brainstormService.ideaHearted(this.board, this.columns);
      } else if (this.eventType === 'BrainstormRemoveSubmissionEvent') {
        this.brainstormService.ideaRemoved(this.board, this.columns);
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.brainstormService.ideaEdited(this.board, this.columns);
      } else if (this.eventType === 'BrainstormCreateCategoryEvent') {
        this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      } else if (this.eventType === 'BrainstormRemoveCategoryEvent') {
        this.columns = this.brainstormService.populateCategories(this.board, this.columns);
      }
    }
    this.sortIdeas(this.columns);
  }

  sortIdeas(columns) {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      col.brainstormidea_set = col.brainstormidea_set.sort((a, b) => b.id - a.id);
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
    this.sendMessage.emit(new BrainstormCreateCategoryEvent('Category ' + newCategoryNumber));
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
    this.sendMessage.emit(new BrainstormRenameCategoryEvent(column.id, event.target.value));
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

  drop(event: CdkDragDrop<string[]>) {
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

  sendCategorizeEvent(event) {
    const id = event.container.data[event.currentIndex].id;
    let categoryId;
    this.board.brainstormcategory_set.forEach((cat) => {
      cat.brainstormidea_set.forEach((idea) => {
        if (idea.id === id) {
          categoryId = cat.id;
        }
      });
    });
    this.sendMessage.emit(new BrainstormSetCategoryEvent(id, categoryId));
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
