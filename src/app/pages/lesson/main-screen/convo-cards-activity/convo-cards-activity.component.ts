import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivitySettingsService } from 'src/app/services';
import { CardsShuffleEvent } from 'src/app/services/backend/schema';
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
  constructor(private activitySettingsService: ActivitySettingsService) {
    super();
  }

  ngOnInit(): void {
    this.mainTitle = this.activityState.convoactivity.main_title;
    this.titleText = this.activityState.convoactivity.title_text;

    this.activitySettingsService.settingChange$.subscribe((val) => {
      const dealNumber = this.activityState.convoactivity.deal_number;
      if (val) {
        if (val.controlName === 'reshuffle') {
          this.sendMessage.emit(new CardsShuffleEvent(dealNumber));
        }
      }
    });
  }
  ngOnChanges() {}

  shuffle() {}
}
