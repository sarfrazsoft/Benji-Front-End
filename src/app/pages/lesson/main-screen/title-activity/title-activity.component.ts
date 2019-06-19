import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmojiLookupService } from 'src/app/services';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-title-activity',
  templateUrl: './title-activity.component.html',
  styleUrls: ['./title-activity.component.scss']
})
export class MainScreenTitleActivityComponent extends BaseActivityComponent
  implements OnInit {
  isEndSession = false;
  @ViewChild('titleTimer') titleTimer;

  constructor(private emoji: EmojiLookupService, private router: Router) {
    super();
  }

  ngOnInit() {
    if (
      this.activityState.base_activity.activity_id === 'end_session_activity'
    ) {
      this.isEndSession = true;
    }
  }

  public backToStart() {
    this.router.navigate(['/landing']);
  }
}
