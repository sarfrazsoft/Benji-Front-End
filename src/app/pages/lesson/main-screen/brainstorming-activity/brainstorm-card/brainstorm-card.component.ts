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
import { ActivitiesService } from 'src/app/services/activities';
import {
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
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { IdeaDetailedDialogComponent } from 'src/app/shared/dialogs/idea-detailed-dialog/idea-detailed.dialog';
import { environment } from 'src/environments/environment';
import { BaseActivityComponent } from '../../../shared/base-activity.component';

@Component({
  selector: 'benji-brainstorm-card',
  templateUrl: './brainstorm-card.component.html',
})
export class BrainstormCardComponent implements OnInit, OnChanges {
  @Input() item;
  @Input() category;
  @Input() submissionScreen;
  @Input() voteScreen;
  @Input() act: BrainstormActivity;
  @Input() activityState: UpdateMessage;
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

  // columns = [];
  // cycle = 'first';

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private activitiesService: ActivitiesService
  ) {
    // super();
  }

  ngOnInit(): void {}

  ngOnChanges() {}

  delete(id) {
    this.deleteIdea.emit(id);
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
      return this.getParticipantName(idea.submitting_participant.participant_code);
    }
  }

  getParticipantName(code: number) {
    return this.activitiesService.getParticipantName(this.activityState, code);
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

  isHearted(item: Idea) {
    let hearted = false;
    item.hearts.forEach((element) => {
      if (element.participant === this.participantCode) {
        hearted = true;
      }
      // If a trainer hearts an idea the heart object does not have
      // a participant code.
      if (element.participant === null) {
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
      // If a trainer hearts an idea the heart object does not have
      // a participant code.
      if (element.participant === null) {
        hearted = element;
      }
    });
    this.sendMessage.emit(new BrainstormRemoveIdeaHeartEvent(item.id, hearted.id));
  }

  setHeart(ideaId) {
    this.sendMessage.emit(new BrainstormSubmitIdeaHeartEvent(ideaId));
  }

  showDetailedIdea(idea: Idea) {
    const dialogRef = this.dialog.open(IdeaDetailedDialogComponent, {
      width: '621px',
      panelClass: 'idea-dialog',
      data: {
        showCategoriesDropdown: this.categorizeFlag,
        categories: this.activityState.brainstormactivity.brainstormcategory_set,
        item: this.item,
        category: this.category,
        group: this.myGroup,
        activityState: this.activityState,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
