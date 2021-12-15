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
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { differenceBy, includes, remove } from 'lodash';
import * as global from 'src/app/globals';
import { ActivitiesService, BrainstormService } from 'src/app/services/activities';
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
  animations: [
    trigger('enableDisable', [
      // ...
      state('enabled', style({
        opacity: 1,
      })),
      state('disabled', style({
        opacity: 0,
      })),
      transition('enabled => disabled', [
        animate('0.1s')
      ]),
      transition('disabled => enabled', [
        animate('0.1s')
      ]),
    ])
  ]
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
    private activitiesService: ActivitiesService,
    private brainstormService: BrainstormService
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
    if (idea) {
      if (idea.submitting_participant) {
        return this.getParticipantName(idea.submitting_participant.participant_code);
      } else {
        return this.getParticipantName(null);
      }
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

  hasParticipantHearted(item: Idea) {
    let hearted = false;
    item.hearts.forEach((element) => {
      if (element.participant === this.participantCode) {
        hearted = true;
      }
      // If a trainer hearts an idea the heart object does not have
      // a participant code.
      if (element.participant === null && !this.participantCode) {
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
      if (element.participant === null && !this.participantCode) {
        hearted = element;
      }
    });
    this.sendMessage.emit(new BrainstormRemoveIdeaHeartEvent(item.id, hearted.id));
  }

  setHeart(ideaId: number) {
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
    const sub = dialogRef.componentInstance.sendMessage.subscribe((event) => {
      this.sendMessage.emit(event);
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.brainstormService.saveIdea$.next(result);
      }
    });
  }

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    const first = fullName[0] ? fullName[0].charAt(0) : '';
    const second = fullName[1] ? fullName[1].charAt(0) : '';
    return (first + second).toUpperCase();
  }

}
