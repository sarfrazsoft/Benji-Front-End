import { Component, OnInit, ViewChild } from '@angular/core';
import { EmojiLookupService } from 'src/app/services';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-title-activity',
  templateUrl: './title-activity.component.html',
  styleUrls: ['./title-activity.component.scss']
})
export class ParticipantTitleActivityComponent extends BaseActivityComponent
  implements OnInit {
  constructor(public emoji: EmojiLookupService) {
    super();
  }

  ngOnInit() {}
}
