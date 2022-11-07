import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { BrainstormSubmitIdeaCommentResponse, UpdateMessage } from '../backend/schema';
import { LessonRunNotification } from '../backend/schema/notification';

@Injectable()
export class BrainstormEventService {
  set ideaCommentEvent(l: BrainstormSubmitIdeaCommentResponse) {
    this.ideaCommentEvent$.next(l);
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
    this.hostBoardId$.next(l);
  }

  constructor() {}

  ideaCommentEvent$ = new Subject<BrainstormSubmitIdeaCommentResponse>();

  notifications$ = new BehaviorSubject<Array<LessonRunNotification>>(null);

  activityState$ = new BehaviorSubject<UpdateMessage>(null);

  hostBoardId$ = new BehaviorSubject<number>(null);

  participantBoardId$ = new BehaviorSubject<number>(null);
}
