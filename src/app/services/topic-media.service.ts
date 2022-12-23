import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TopicMedia } from './backend/schema';

@Injectable()
export class TopicMediaService {
  /**
   * Setting change
   */
  topicMedia$ = new BehaviorSubject<TopicMedia>(null);

  set topicMedia(topicMedia: TopicMedia) {
    this.topicMedia$.next(topicMedia);
  }
  get topicMedia(): TopicMedia {
    return this.topicMedia$.getValue();
  }
  constructor() {}
}
