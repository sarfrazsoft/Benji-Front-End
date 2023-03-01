import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import {
  ActivitiesService,
  BoardsNavigationService,
  BrainstormEventService,
  BrainstormPostService,
  BrainstormService,
} from 'src/app/services/activities';
import {
  AvatarSize,
  Board,
  BrainstormSubmitIdeaCommentEvent,
  EventTypes,
  Idea,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IdeaDetailedDialogComponent } from 'src/app/shared/dialogs/idea-detailed-dialog/idea-detailed.dialog';

@UntilDestroy()
@Component({
  selector: 'benji-card-feedback',
  templateUrl: './card-feedback.component.html',
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
export class CardFeedbackComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() board: Board;
  @Input() item: Idea;
  @Input() participantCode;
  @Input() eventType;
  @Input() avatarSize: AvatarSize;
  @Input() isAdmin;
  @Input() activityState: UpdateMessage;
  @Input() ideaDetailedDialogRef: MatDialogRef<IdeaDetailedDialogComponent, any>;

  @Output() sendMessage = new EventEmitter<any>();
  @Output() viewChanged = new EventEmitter<any>();

  commentModel = '';
  submittingUser = undefined;

  deactivateHearting: boolean;
  localActivityState: UpdateMessage;
  userSubmittedComment = false;
  userSubmittedSuccesfully = false;
  commentKey: string;
  imgSrc = '/assets/img/cards/like.svg';
  classGrey: boolean;
  classWhite: boolean;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService,
    private brainstormService: BrainstormService,
    private brainstormPostService: BrainstormPostService,
    private brainstormEventService: BrainstormEventService,
    private boardsNavigationService: BoardsNavigationService,
    private deviceService: DeviceDetectorService,
    private _ngZone: NgZone,
    private ngxPermissionsService: NgxPermissionsService,
    private boardStatusService: BoardStatusService,
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.item && this.item.submitting_participant) {
      this.submittingUser = this.item.submitting_participant.participant_code;
      this.commentKey = 'comment_' + this.item.id + this.submittingUser;
    } else {
      // it is host's idea
      if (this.participantCode) {
        // a participant is viewing it
        this.commentKey = 'comment_' + this.item.id + 'host';
      }
    }

    if (this.participantCode) {
    } else {
      this.commentKey = 'comment_' + this.item?.id + 'host';
    }

    const draftComment = this.brainstormService.getDraftComment(this.commentKey);
    if (draftComment) {
      this.commentModel = draftComment;
    }

    // this.brainstormEventService.ideaCommentEvent$.subscribe((v: BrainstormSubmitIdeaCommentResponse) => {
    //   // Add the comment to the card
    //   this.addComment();
    // });
  }

  ngOnDestroy() {}

  ngAfterViewInit() {}

  areHeartsAllowed() {
    return this.board.allow_heart;
  }

  ngOnChanges(changes) {
    if (
      this.activityState.eventType !== EventTypes.brainstormSubmitIdeaCommentEvent &&
      this.activityState.eventType !== EventTypes.notificationEvent
    ) {
      this.localActivityState = this.activityState;
    }

    if (this.activityState.eventType === EventTypes.brainstormSubmitIdeaCommentEvent) {
      this.addComment();
    }
  }

  addComment() {
    if (this.ideaDetailedDialogRef) {
      this.ideaDetailedDialogRef.componentInstance.brainstormSubmitIdeaCommentEvent();
    }
    if (this.userSubmittedComment) {
      let existingComment = '';
      if (this.ideaDetailedDialogRef) {
        existingComment = this.brainstormService.getDraftComment(this.commentKey);
        existingComment = existingComment.trim();
      } else {
        existingComment = this.commentModel;
        existingComment = existingComment.trim();
      }
      this.item.comments.forEach((c) => {
        existingComment = existingComment.trim();
        if (
          c.comment === existingComment &&
          (c.participant === this.participantCode || !this.participantCode) &&
          !this.userSubmittedSuccesfully
        ) {
          // there is a comment by this participant in the comments that is identical to commentModal
          // safe to assume the comment is submitted
          this.userSubmittedSuccesfully = true;
          this.userSubmittedComment = false;
          this.removeDraftComment();

          if (this.ideaDetailedDialogRef) {
            this.ideaDetailedDialogRef.componentInstance.ideaCommentSuccessfullySubmitted();
          }
        }
      });
    }
  }

  submitComment(ideaId, val) {
    this.userSubmittedComment = true;
    this.userSubmittedSuccesfully = false;
    this.commentModel = val;
    this.sendMessage.emit(new BrainstormSubmitIdeaCommentEvent(val, ideaId));
  }

  removeDraftComment() {
    this.commentModel = '';
    this.brainstormService.removeDraftComment(this.commentKey);
  }

  onCommentFocus() {
    this.classGrey = true;
  }
  onCommentBlur() {
    this.classGrey = false;
  }

  commentTyped() {
    this.viewChanged.emit();
    this.brainstormService.saveDraftComment(this.commentKey, this.commentModel);
  }
}
