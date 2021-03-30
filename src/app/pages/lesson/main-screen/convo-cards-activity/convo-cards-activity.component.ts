import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-convo-cards-activity',
  templateUrl: './convo-cards-activity.component.html',
})
export class MainScreenConvoCardsActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  mainTitle = 'Conversation Cards';
  titleText = 'Instructions to be provided by the instructor';
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.mainTitle = this.activityState.convoactivity.main_title;
    this.titleText = this.activityState.convoactivity.title_text;
  }
  ngOnChanges() {}
}
