import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContextService, EmojiLookupService } from 'src/app/services';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-title-activity',
  templateUrl: './title-activity.component.html',
  styleUrls: ['./title-activity.component.scss'],
})
export class MainScreenTitleActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  isEndSession = false;
  mainTitle = '';
  titleText = '';
  @ViewChild('titleTimer') titleTimer;

  constructor(
    private emoji: EmojiLookupService,
    private router: Router,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    const act = this.activityState;
    if (this.isLastActivity()) {
      this.isEndSession = true;
    }
  }

  ngOnChanges() {
    // console.log(JSON.stringify(this.activityState));
    // console.log(this.activityState);
    // if (this.activityState.titleactivity) {
    this.mainTitle = this.activityState.titleactivity.main_title;
    this.titleText = this.activityState.titleactivity.title_text;
    // }
    const act = this.activityState;
    this.contextService.activityTimer = this.getNextActStartTimer();
  }

  public backToStart() {
    this.router.navigate(['/landing']);
  }
}
