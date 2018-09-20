import {Component, Input, Output, OnInit, OnDestroy, ViewEncapsulation, EventEmitter} from '@angular/core';
import {BaseActivityComponent} from '../../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-lobby',
  templateUrl: './main-screen-lobby.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopLobbyComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  @Input() joinedUsers;
  @Output() activityComplete = new EventEmitter();;

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  start_activities() {
    this.activityComplete.emit(true);
  }
}
