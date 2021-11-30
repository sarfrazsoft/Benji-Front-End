import { Component, OnChanges, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { ActivitySettingsService } from 'src/app/services';
import { CardsShuffleEvent } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
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
  showShuffleButton = false;
  constructor(private activitySettingsService: ActivitySettingsService, private utilsService: UtilsService) {
    super();
  }

  times = ['30 seconds', '45 seconds', '1 minute', '2 minutes', '3 minutes', '4 minutes', '5 minutes'];

  ngOnInit(): void {
    this.mainTitle = this.activityState.convoactivity.main_title;
    this.titleText = this.activityState.convoactivity.title_text;

    const participantCards = this.activityState.convoactivity.participant_cards;
    if (!isEmpty(participantCards)) {
      this.showShuffleButton = true;
    }

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

  shuffle() {
    const dealNumber = this.activityState.convoactivity.deal_number;
    this.sendMessage.emit(new CardsShuffleEvent(dealNumber));
    this.utilsService.openSuccessNotification('Cards reshuffled', '');
  }
}
