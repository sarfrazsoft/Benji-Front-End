import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UpdateMessage } from './backend/schema';

@Injectable()
export class GroupingToolService {
  /**
   * Setting change
   */
  showGroupingToolMainScreen$ = new BehaviorSubject<any>(null);

  set showGroupingToolMainScreen(lesson: boolean) {
    this.showGroupingToolMainScreen$.next(lesson);
  }
  get showGroupingToolMainScreen(): boolean {
    return this.showGroupingToolMainScreen$.getValue();
  }
  constructor() {}
}
