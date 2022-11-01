import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TitleActivityLayouts } from 'src/app/globals';
import { ContextService, EmojiLookupService } from 'src/app/services';
import { TitleActivity } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-title-activity',
  templateUrl: './title-activity.component.html',
})
export class MainScreenTitleActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  isEndSession = false;
  mainTitle = '';
  titleText = '';

  imageLayout = true;
  layout: string;
  title_emoji: string;
  title_image: any;

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
    const act = this.activityState.titleactivity;
    this.loadVariables(act);
  }

  ngOnChanges() {
    const act = this.activityState.titleactivity;
    this.loadVariables(act);
  }

  loadVariables(act: TitleActivity) {
    this.mainTitle = act.main_title ? act.main_title : '';
    this.titleText = act.title_text ? act.title_text : '';
    this.layout = act.layout ? act.layout : '';
    this.title_emoji = act.title_emoji ? act.title_emoji : '';
    this.title_image = act.title_image ? act.title_image : '';
  }

  public backToStart() {
    this.router.navigate(['/landing']);
  }
}
