import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BoardStatus, UpdateMessage } from './backend/schema';

@Injectable()
export class BoardStatusService {
  /**
   * Setting change
   */
  boardStatus$ = new BehaviorSubject<BoardStatus>(null);

  set boardStatus(boardStatus: BoardStatus) {
    this.boardStatus$.next(boardStatus);
  }
  get boardStatus(): BoardStatus {
    return this.boardStatus$.getValue();
  }
  constructor() {}
}
