import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UpdateMessage } from './backend/schema';

@Injectable()
export class SharingToolService {
  /**
   * Setting change
   */
  sharingToolControl$ = new BehaviorSubject<any>(null);

  set sharingToolControl(lesson: UpdateMessage) {
    this.sharingToolControl$.next(lesson);
  }
  get sharingToolControl(): UpdateMessage {
    return this.sharingToolControl$.getValue();
  }
  constructor() {}
}
