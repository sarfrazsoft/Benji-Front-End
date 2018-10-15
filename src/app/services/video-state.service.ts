import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoStateService {
  private stateChangedSource = new Subject<any>();

  public stateChanged$ = this.stateChangedSource.asObservable();

  constructor() {
  }
  public updateState(videoState) {
    this.stateChangedSource.next(videoState);
  }


}
