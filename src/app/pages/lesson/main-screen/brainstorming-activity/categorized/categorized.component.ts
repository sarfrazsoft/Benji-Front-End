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
import * as global from 'src/app/globals';
import {
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
  Idea,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-categorized-ideas',
  templateUrl: './categorized.component.html',
})
export class CategorizedComponent implements OnInit, OnChanges {
  @Input() submissionScreen;
  @Input() voteScreen;
  @Input() act;
  @Input() activityState;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
  @Input() showUserName;
  @Input() participantCode;
  @Input() eventType;
  @ViewChild('colName') colNameElement: ElementRef;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();

  columns = [];
  cycle = 'first';

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.cycle === 'first') {
      this.populateCategories();
      this.cycle = 'second';
    } else {
      // let eventType;
      // eventType = 'AddedIdea';
      // eventType = 'heartedIdea';
      // eventType = 'removeIdea';
      // console.log(this.eventType);
      if (this.eventType === 'BrainstormSubmitEvent') {
        this.addIdeaToCategory();
      } else if (this.eventType === 'BrainstormSubmitIdeaCommentEvent') {
        this.ideaCommented();
      } else if (this.eventType === 'BrainstormRemoveIdeaCommentEvent') {
        this.ideaCommented();
      } else if (this.eventType === 'BrainstormSubmitIdeaHeartEvent') {
        this.ideaHearted();
      } else if (this.eventType === 'BrainstormRemoveIdeaHeartEvent') {
        this.ideaHearted();
      } else if (this.eventType === 'BrainstormRemoveSubmissionEvent') {
        this.ideaRemoved();
      }
    }
  }

  addIdeaToCategory() {
    this.act.brainstormcategory_set.forEach((category, index) => {
      const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
      if (BEIdeas.length === this.columns[index].brainstormidea_set.length) {
      } else {
        const myDifferences = differenceBy(BEIdeas, this.columns[index].brainstormidea_set, 'id');
        this.columns[index].brainstormidea_set.push(myDifferences[0]);
      }
    });
  }

  populateCategories() {
    this.columns = [];
    this.act.brainstormcategory_set.forEach((category) => {
      if (category.brainstormidea_set) {
        category.brainstormidea_set.forEach((idea) => {
          idea = { ...idea, showClose: false, editing: false, addingIdea: false };
        });
      } else {
        // Editor preview panel
      }
    });
    this.columns = this.act.brainstormcategory_set;
  }

  ideaHearted() {
    this.act.brainstormcategory_set.forEach((category, categoryIndex) => {
      if (category.brainstormidea_set) {
        const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
        BEIdeas.forEach((idea, ideaIndex) => {
          const existingHearts = this.columns[categoryIndex].brainstormidea_set[ideaIndex].hearts;
          const existingHeartsLength = existingHearts.length;
          const newHeartsLength = idea.hearts.length;
          if (existingHeartsLength < newHeartsLength) {
            const myDifferences = differenceBy(idea.hearts, existingHearts, 'id');
            existingHearts.push(myDifferences[0]);
          } else if (existingHeartsLength > newHeartsLength) {
            const myDifferences: Array<any> = differenceBy(existingHearts, idea.hearts, 'id');

            remove(existingHearts, (heart: any) => heart.id === myDifferences[0].id);
          }
        });
      }
    });
  }

  ideaCommented() {
    this.act.brainstormcategory_set.forEach((category, categoryIndex) => {
      if (category.brainstormidea_set) {
        const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
        BEIdeas.forEach((idea, ideaIndex) => {
          const existingHearts = this.columns[categoryIndex].brainstormidea_set[ideaIndex].comments;
          const existingHeartsLength = existingHearts.length;
          const newHeartsLength = idea.comments.length;
          if (existingHeartsLength < newHeartsLength) {
            const myDifferences = differenceBy(idea.comments, existingHearts, 'id');
            existingHearts.push(myDifferences[0]);
          } else if (existingHeartsLength > newHeartsLength) {
            const myDifferences: Array<any> = differenceBy(existingHearts, idea.comments, 'id');

            remove(existingHearts, (heart: any) => heart.id === myDifferences[0].id);
          }
        });
      }
    });
  }

  ideaRemoved() {
    this.act.brainstormcategory_set.forEach((category, index) => {
      const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
      if (BEIdeas.length === this.columns[index].brainstormidea_set.length) {
      } else {
        const myDifferences: Array<any> = differenceBy(this.columns[index].brainstormidea_set, BEIdeas, 'id');

        remove(this.columns[index].brainstormidea_set, (idea: any) => idea.id === myDifferences[0].id);
      }
    });
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

  isAbsolutePath(imageUrl: string) {
    // console.log(imageUrl);
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
    column.editing = true;
    setTimeout(() => {
      this.colNameElement.nativeElement.focus();
    }, 0);
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
    this.act.brainstormcategory_set.forEach((cat) => {
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
