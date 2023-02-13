import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { UpdateMessage } from '../backend/schema';
import {
  BrainstormRemoveIdeaCommentResponse,
  BrainstormRemoveIdeaHeartResponse,
  BrainstormSetCategoryResponse,
  BrainstormSubmitIdeaCommentResponse,
  BrainstormSubmitIdeaHeartResponse,
} from '../backend/schema/event-responses';
import { LessonRunNotification } from '../backend/schema/notification';

@Injectable()
export class BrainstormEventService {
  set ideaCommentEvent(l: BrainstormSubmitIdeaCommentResponse) {
    this.ideaCommentEvent$.next(l);
  }

  set ideaCommentReplyEvent(l: BrainstormSubmitIdeaCommentResponse) {
    this.ideaCommentReplyEvent$.next(l);
  }

  set ideaCommentAddHeartEvent(l: BrainstormSubmitIdeaHeartResponse) {
    this.ideaCommentAddHeartEvent$.next(l);
  }

  set ideaCommentRemoveHeartEvent(l: BrainstormRemoveIdeaHeartResponse) {
    this.ideaCommentRemoveHeartEvent$.next(l);
  }

  set ideaRemoveCommentReplyEvent(l: BrainstormRemoveIdeaCommentResponse) {
    this.ideaRemoveCommentReplyEvent$.next(l);
  }

  set categoryChangedForIdea(l: BrainstormSetCategoryResponse) {
    this.categoryChangedForIdea$.next(l);
  }

  set ideaRemoveCommentEvent(l: BrainstormRemoveIdeaCommentResponse) {
    this.ideaRemoveCommentEvent$.next(l);
  }

  set notifications(l: Array<LessonRunNotification>) {
    this.notifications$.next(l);
  }

  set activityState(l: UpdateMessage) {
    this.activityState$.next(l);
  }

  set hostBoardId(l: number) {
    this.hostBoardId$.next(l);
  }

  set participantBoardId(l: number) {
    this.participantBoardId$.next(l);
  }
  get participantBoardId() {
    return this.participantBoardId$.value;
  }

  set showAuthorship(l: boolean) {
    this.showAuthorship$.next(l);
  }

  constructor() {}

  ideaCommentEvent$ = new Subject<BrainstormSubmitIdeaCommentResponse>();

  ideaCommentReplyEvent$ = new Subject<BrainstormSubmitIdeaCommentResponse>();

  categoryChangedForIdea$ = new Subject<BrainstormSetCategoryResponse>();

  ideaCommentAddHeartEvent$ = new Subject<BrainstormSubmitIdeaHeartResponse>();

  ideaCommentRemoveHeartEvent$ = new Subject<BrainstormRemoveIdeaHeartResponse>();

  ideaRemoveCommentEvent$ = new Subject<BrainstormRemoveIdeaCommentResponse>();

  ideaRemoveCommentReplyEvent$ = new Subject<BrainstormRemoveIdeaCommentResponse>();

  notifications$ = new BehaviorSubject<Array<LessonRunNotification>>(null);

  activityState$ = new BehaviorSubject<UpdateMessage>(null);

  hostBoardId$ = new BehaviorSubject<number>(null);

  participantBoardId$ = new BehaviorSubject<number>(null);

  showAuthorship$ = new BehaviorSubject<boolean>(null);
}
