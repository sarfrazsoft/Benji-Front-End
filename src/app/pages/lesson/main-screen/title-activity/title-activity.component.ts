import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContextService, EmojiLookupService } from 'src/app/services';
import { TitleActivity } from 'src/app/services/backend/schema';
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
    if (this.isLastActivity()) {
      this.isEndSession = true;
    }
    const act = this.activityState.titleactivity;
    this.loadVariables(act);
  }

  ngOnChanges() {
    // console.log(JSON.stringify(this.activityState));
    // console.log(this.activityState);
    // if (this.activityState.titleactivity) {
    const act = this.activityState.titleactivity;
    this.loadVariables(act);
    // }
    this.contextService.activityTimer = this.getNextActStartTimer();
  }

  loadVariables(act: TitleActivity) {
    this.mainTitle = act.main_title ? act.main_title : '';
    this.titleText = act.title_text ? act.title_text : '';
  }

  public backToStart() {
    this.router.navigate(['/landing']);
  }
}
