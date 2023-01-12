import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BrainstormService } from 'src/app/services/activities';
import {
  BrainstormSubmitIdeaCommentEvent,
  BrainstormSubmitReplyReviewCommentEvent,
  Idea,
  IdeaComment,
} from 'src/app/services/backend/schema';

@UntilDestroy()
@Component({
  selector: 'benji-comment-reply',
  templateUrl: './comment-reply.component.html',
})
export class CommentReplyComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() item: Idea;
  @Input() participantCode;
  @Input() comment: IdeaComment;

  @Output() sendMessage = new EventEmitter<any>();
  @Output() viewChanged = new EventEmitter<any>();

  commentModel = '';
  submittingUser = undefined;

  userSubmittedComment = false;
  userSubmittedSuccesfully = false;
  commentKey: string;
  imgSrc = '/assets/img/cards/like.svg';
  classGrey: boolean;
  classWhite: boolean;

  constructor(private brainstormService: BrainstormService) {}

  ngOnInit(): void {
    if (this.item && this.item.submitting_participant) {
      this.submittingUser = this.item.submitting_participant.participant_code;
    } else {
      // it is host's idea
      if (this.participantCode) {
        // a participant is viewing it
      }
    }
  }

  ngOnDestroy() {}

  ngAfterViewInit() {}

  ngOnChanges() {}

  addReply() {
    this.sendMessage.emit(new BrainstormSubmitReplyReviewCommentEvent(this.comment.id, this.commentModel));
    this.commentModel = '';
    this.comment['addingReply'] = false;
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

  commentTyped() {
    this.viewChanged.emit();
    this.brainstormService.saveDraftComment(this.commentKey, this.commentModel);
  }

  cancel() {
    this.comment['addingReply'] = false;
  }
}
