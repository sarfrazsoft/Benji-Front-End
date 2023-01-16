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
import { find, remove } from 'lodash';
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
  Board,
  BrainstormRemoveCommentHeartEvent,
  BrainstormRemoveIdeaCommentEvent,
  BrainstormRemoveIdeaHeartEvent,
  BrainstormRemoveReplyReviewCommentEvent,
  BrainstormSubmitCommentHeartEvent,
  BrainstormSubmitIdeaCommentEvent,
  BrainstormSubmitIdeaHeartEvent,
  CommentHeart,
  EventTypes,
  Idea,
  IdeaComment,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import {
  BrainstormRemoveCommentHeartResponse,
  BrainstormRemoveIdeaCommentResponse,
  BrainstormSubmitIdeaCommentResponse,
  BrainstormSubmitIdeaHeartResponse,
} from 'src/app/services/backend/schema/event-responses';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IdeaDetailedDialogComponent } from 'src/app/shared/dialogs/idea-detailed-dialog/idea-detailed.dialog';

@UntilDestroy()
@Component({
  selector: 'benji-posted-comment',
  templateUrl: './posted-comment.component.html',
})
export class PostedCommentComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() board: Board;
  @Input() item: Idea;
  @Input() comment: IdeaComment;
  @Input() participantCode;
  @Input() eventType;
  @Input() isAdmin;
  @Input() allowReply = true;
  @Input() avatarSize;
  @Input() commentIndex;
  @Input() activityState: UpdateMessage;
  @Input() ideaDetailedDialogRef: MatDialogRef<IdeaDetailedDialogComponent, any>;

  @Output() sendMessage = new EventEmitter<any>();
  @Output() viewChanged = new EventEmitter<any>();

  submittingUser = undefined;

  deactivateHearting: boolean;
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
    } else {
      // it is host's idea
    }

    this.brainstormEventService.ideaCommentReplyEvent$.subscribe((v: BrainstormSubmitIdeaCommentResponse) => {
      if (this.comment.id === v.parent_comment) {
        const newComment = find(this.comment.reply_comments, { id: v.id });
        if (!newComment) {
          this.comment.reply_comments.push({
            id: v.id,
            comment: v.comment,
            comment_hearts: [],
            participant: v.participant,
          });
        }
      }
    });

    this.brainstormEventService.ideaRemoveCommentReplyEvent$.subscribe(
      (v: BrainstormRemoveIdeaCommentResponse) => {
        if (this.comment.id === v.parent_comment) {
          remove(this.comment.reply_comments, { id: v.comment_id });
        }
      }
    );

    this.brainstormEventService.ideaCommentAddHeartEvent$.subscribe(
      (v: BrainstormSubmitIdeaHeartResponse) => {
        // child comment liked
        // board_id: 3347
        // brainstormidea_id: 6181
        // heart: true
        // id: 186
        // parent: 103
        // parent_comment: 2584
        // participant: null

        // root comment liked
        // board_id: 3347
        // brainstormidea_id: 6181
        // heart: true
        // id: 187
        // parent: null
        // parent_comment: 2584

        // child
        if (v.parent && v.parent_comment && this.comment.id === v.parent) {
          const newHeart = find(this.comment.comment_hearts, { id: v.id });
          if (!newHeart) {
            this.comment.comment_hearts.push({
              id: v.id,
              participant: v.participant,
            });
          }
        } else if (!v.parent && this.comment.id === v.parent_comment) {
          // root comment
          const newHeart = find(this.comment.comment_hearts, { id: v.id });
          if (!newHeart) {
            this.comment.comment_hearts.push({
              id: v.id,
              participant: v.participant,
            });
          }
        }
      }
    );

    this.brainstormEventService.ideaCommentRemoveHeartEvent$.subscribe(
      (v: BrainstormRemoveCommentHeartResponse) => {
        if (this.item.id === v.brainstormidea_id) {
          for (let i = 0; i < this.comment.comment_hearts.length; i++) {
            const heart = this.comment.comment_hearts[i];
            if (heart.id === v.heart_id) {
              remove(this.comment.comment_hearts, { id: heart.id });
            }
          }
        }
      }
    );
  }

  ngOnDestroy() {}

  ngAfterViewInit() {}

  areHeartsAllowed() {
    return this.board.allow_heart;
  }

  ngOnChanges(changes) {}

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

  removeComment(commentId, ideaId) {
    if (this.allowReply) {
      this.sendMessage.emit(new BrainstormRemoveIdeaCommentEvent(commentId, ideaId));
    } else {
      // we're deleting a child comment
      this.sendMessage.emit(new BrainstormRemoveReplyReviewCommentEvent(commentId));
    }
  }

  canDeleteComment(participantCode) {
    if (this.participantCode && this.participantCode === participantCode) {
      return true;
    }
    return false;
  }

  hasUserHeartedComment(comment: IdeaComment): boolean {
    const commentHearted = this.brainstormPostService.hasUserHeartedComment(comment, this.participantCode);
    return commentHearted;
  }

  removeHeart(item, event) {
    if (!this.board.allow_heart) {
      return;
    }
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
    this.imgSrc = '/assets/img/cards/like.svg';
  }

  likeClicked(comment: IdeaComment): void {
    if (this.hasUserHeartedComment(comment)) {
      this.removeCommentHeart(comment);
    } else {
      this.setCommentHeart(comment);
    }
  }

  setCommentHeart(comment: IdeaComment): void {
    if (this.allowReply) {
      this.sendMessage.emit(new BrainstormSubmitCommentHeartEvent(comment.id, null));
    } else {
      console.log(comment.parent_comment);
      // this is a reply comment
      // we also need to pass rootComment
      this.sendMessage.emit(new BrainstormSubmitCommentHeartEvent(comment.parent_comment, comment.id));
    }
  }

  removeCommentHeart(comment: IdeaComment): void {
    const heart: CommentHeart = this.brainstormPostService.getMyCommentHeart(comment, this.participantCode);
    if (heart) {
      this.sendMessage.emit(new BrainstormRemoveCommentHeartEvent(heart.id));
    }
  }

  addReplyToCommentUI(comment: IdeaComment) {
    comment['addingReply'] = true;
    this.viewChanged.emit();
  }
}
