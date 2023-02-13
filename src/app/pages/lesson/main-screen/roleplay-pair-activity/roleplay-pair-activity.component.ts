import { Component, OnInit } from '@angular/core';
import { EmojiLookupService } from 'src/app/services';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-roleplay-pair-activity',
  templateUrl: './roleplay-pair-activity.component.html',
  styleUrls: ['./roleplay-pair-activity.component.scss'],
})
export class MainScreenPairActivityComponent extends BaseActivityComponent implements OnInit {
  ngOnInit() {
    super.ngOnInit();
  }

  constructor(private emoji: EmojiLookupService) {
    super();
  }
}
