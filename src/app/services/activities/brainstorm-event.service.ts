import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { UpdateMessage } from '../backend/schema';

@Injectable()
export class BrainstormEventService {
  set ideaCommentEvent(l: UpdateMessage) {
    this.ideaCommentEvent$.next(l);
  }

  constructor() {}

  ideaCommentEvent$ = new Subject<UpdateMessage>();
}
