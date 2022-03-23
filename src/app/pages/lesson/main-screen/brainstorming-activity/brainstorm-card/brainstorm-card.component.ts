import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { take } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ActivitiesService, BrainstormService } from 'src/app/services/activities';
import {
  Board,
  BrainstormActivity,
  BrainstormAddIdeaPinEvent,
  BrainstormRemoveIdeaCommentEvent,
  BrainstormRemoveIdeaHeartEvent,
  BrainstormRemoveIdeaPinEvent,
  BrainstormSubmitIdeaCommentEvent,
  BrainstormSubmitIdeaHeartEvent,
  Idea,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { IdeaDetailedInfo, IdeaUserRole } from 'src/app/shared/components/idea-detailed/idea-detailed';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs';
import { IdeaDetailedDialogComponent } from 'src/app/shared/dialogs/idea-detailed-dialog/idea-detailed.dialog';
import { blockQuoteRule } from 'src/app/shared/ngx-editor/plugins/input-rules';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-brainstorm-card',
  templateUrl: './brainstorm-card.component.html',
  animations: [
    trigger('enableDisable', [
      // ...
      state(
        'enabled',
        style({
          opacity: 1,
          display: 'block',
        })
      ),
      state(
        'disabled',
        style({
          opacity: 0,
          display: 'none',
        })
      ),
      transition('enabled => disabled', [animate('0.1s')]),
      transition('disabled => enabled', [animate('0.1s')]),
    ]),
  ],
})
export class BrainstormCardComponent implements OnInit, OnChanges {
  @Input() board: Board;
  @Input() item: Idea;
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
  @Input() avatarSize;
  @ViewChild('colName') colNameElement: ElementRef;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();
  @Output() commentEdited = new EventEmitter<any>();

  commentModel = '';
  submittingUser;
  submitting_participant;
  userRole: IdeaUserRole;
  deactivateHearting = false;
  classGrey: boolean;
  classWhite: boolean;
  commentKey: string;
  imgSrc = '/assets/img/cards/like.svg';
  // columns = [];
  // cycle = 'first';

  // @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private dialog: MatDialog,
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService,
    private brainstormService: BrainstormService,
    private deviceService: DeviceDetectorService,
    private _ngZone: NgZone,
    private ngxPermissionsService: NgxPermissionsService
  ) {
    // super();
  }

  ngOnInit(): void {
    if (this.item && this.item.submitting_participant) {
      this.submittingUser = this.item.submitting_participant.participant_code;
      this.commentKey = 'comment_' + this.item.id + this.submittingUser;
    }

    if (this.participantCode) {
      this.userRole = 'viewer';
    } else {
      // viewing user is the host
      this.userRole = 'owner';
      this.commentKey = 'comment_' + this.item.id + 'host';
    }

    if (this.item && this.item.submitting_participant && this.userRole !== 'owner') {
      this.submittingUser = this.item.submitting_participant.participant_code;
      if (this.submittingUser === this.participantCode) {
        this.userRole = 'owner';
      } else {
        this.userRole = 'viewer';
      }
    }

    const draftComment = this.brainstormService.getDraftComment(this.commentKey);
    if (draftComment) {
      this.commentModel = draftComment;
    }
  }

  // triggerResize() {
  //   // Wait for changes to be applied, then trigger textarea resize.
  //   this._ngZone.onStable.pipe(take(1)).subscribe(() => {
  //     console.log("Anonymous triggerResize");
  //     this.autosize.resizeToFitContent(true);
  //   });
  //   console.log("triggerResize");
  // }

  ngOnChanges() {}

  delete(id) {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'Are you sure you want to delete this idea?',
          actionButton: 'Delete',
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.deleteIdea.emit(id);
        }
      });
  }

  unpin(id) {
    this.ngxPermissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.sendMessage.emit(new BrainstormRemoveIdeaPinEvent(id));
      }
    });
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
    this.brainstormService.removeDraftComment(this.commentKey);
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
        this.deactivateHearting = false;
      }
      // If a trainer hearts an idea the heart object does not have
      // a participant code.
      if (element.participant === null && !this.participantCode) {
        hearted = true;
        this.deactivateHearting = false;
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
    if (hearted) {
      this.sendMessage.emit(new BrainstormRemoveIdeaHeartEvent(item.id, hearted.id));
    }
  }

  setHeart(idea: Idea) {
    if (!this.deactivateHearting) {
      this.deactivateHearting = true;
      this.sendMessage.emit(new BrainstormSubmitIdeaHeartEvent(idea.id));
    }
  }

  showDetailedIdea(idea: Idea) {
    if (this.deviceService.isMobile()) {
      this.openDialog(idea, 'idea-detailed-mobile-dialog', false);
    } else {
      this.openDialog(idea, 'idea-detailed-dialog', true);
    }

    // this.openDialog(idea, 'idea-detailed-mobile-dialog', false);
    // this.openDialog(idea, 'idea-detailed-dialog', true);
  }

  openDialog(idea: Idea, assignedClass, isDesktop) {
    const dialogRef = this.dialog.open(IdeaDetailedDialogComponent, {
      disableClose: true,
      hasBackdrop: isDesktop,
      panelClass: assignedClass,
      data: {
        showCategoriesDropdown: this.categorizeFlag,
        categories: this.board.brainstormcategory_set,
        item: this.item,
        category: this.category,
        myGroup: this.myGroup,
        activityState: this.activityState,
        isMobile: !isDesktop,
        participantCode: this.participantCode,
        userRole: this.userRole,
        showUserName: this.showUserName,
      } as IdeaDetailedInfo,
    });
    const sub = dialogRef.componentInstance.sendMessage.subscribe((event) => {
      this.sendMessage.emit(event);
    });

    dialogRef.componentInstance.deleteIdea.subscribe((event) => {
      this.deleteIdea.emit(event);
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.brainstormService.saveIdea$.next(result);
      }
    });
  }

  onCommentFocus() {
    this.classGrey = true;
  }
  onCommentBlur() {
    this.classGrey = false;
  }

  commentTyped() {
    this.commentEdited.emit();
    this.brainstormService.saveDraftComment(this.commentKey, this.commentModel);
  }

  videoLoaded() {
    this.commentEdited.emit();
  }
}
