import { Component, OnChanges, OnInit } from '@angular/core';
import { EmojiLookupService } from 'src/app/services/emoji-lookup.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-generic-roleplay-activity',
  templateUrl: './generic-roleplay-activity.component.html',
  styleUrls: ['./generic-roleplay-activity.component.scss']
})
export class MainScreenGenericRoleplayActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  roles;
  giveFeedback = true;

  constructor(private emoji: EmojiLookupService) {
    super();
  }

  ngOnChanges() {
    this.roles = this.activityState.genericroleplayactivity.genericroleplayrole_set;
  }

  ngOnInit() {}
}
