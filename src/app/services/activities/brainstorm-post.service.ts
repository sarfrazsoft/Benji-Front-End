import { Injectable } from '@angular/core';
import { CommentHeart, Idea, IdeaComment } from '../backend/schema';

@Injectable()
export class BrainstormPostService {
  constructor() {}

  hasUserHearted(item: Idea, participantCode: number): boolean {
    let hearted = false;
    item.hearts.forEach((element) => {
      if (
        element.participant === participantCode ||
        // If a trainer hearts an idea the heart object does not have
        // a participant code.
        (element.participant === null && !participantCode)
      ) {
        hearted = true;
      }
    });
    return hearted;
  }

  hasUserHeartedComment(comment: IdeaComment, participantCode: number): boolean {
    let hearted = false;
    comment.comment_hearts.forEach((element) => {
      if (
        element.participant === participantCode ||
        // If a trainer hearts an idea the heart object does not have
        // a participant code.
        (element.participant === null && !participantCode)
      ) {
        hearted = true;
      }
    });
    return hearted;
  }

  getMyCommentHeart(comment: IdeaComment, participantCode: number): CommentHeart {
    let h: CommentHeart;
    comment.comment_hearts.forEach((element) => {
      if (
        element.participant === participantCode ||
        // If a trainer hearts an idea the heart object does not have
        // a participant code.
        (element.participant === null && !participantCode)
      ) {
        h = element;
      }
    });
    return h;
  }
}
