import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoStateService {
  /**
   * Current State of video
   */
  videoState$ = new BehaviorSubject<any>(null);

  set videoState(videoState: any) {
    this.videoState$.next(videoState);
  }
  get videoState(): any {
    return this.videoState$.getValue();
  }
}
