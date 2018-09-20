import {Component, OnInit, ViewEncapsulation, OnDestroy, Input} from '@angular/core';
import {BaseActivityComponent} from '../../../shared/base-activity.component';

@Component({
  selector: 'app-participant-lobby',
  templateUrl: './participant-lobby.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileLobbyComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  @Input() joinedUsers;

  ngOnInit() {
  }

  ngOnDestroy () {
  }
}
