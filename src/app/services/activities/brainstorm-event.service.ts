import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { UpdateMessage } from '../backend/schema';
import { LessonRunNotification } from '../backend/schema/notification';

@Injectable()
export class BrainstormEventService {
  set ideaCommentEvent(l: UpdateMessage) {
    this.ideaCommentEvent$.next(l);
  }

  set notifications(l: Array<LessonRunNotification>) {
    this.notifications$.next(l);
  }

  constructor() {}

  ideaCommentEvent$ = new Subject<UpdateMessage>();

  notifications$ = new BehaviorSubject<Array<LessonRunNotification>>(null);
}
