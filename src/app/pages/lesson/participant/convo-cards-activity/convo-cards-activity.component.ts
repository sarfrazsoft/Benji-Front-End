import { Component, OnChanges, OnInit } from '@angular/core';
import { isEmpty } from 'lodash';
import { ParticipantSelectCardEvent, UpdateMessage } from 'src/app/services/backend/schema';
import { Card, ConvoCardsActivity } from 'src/app/services/backend/schema/activities';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-convo-cards-activity',
  templateUrl: './convo-cards-activity.component.html',
})
export class ParticipantConvoCardsActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges
{
  items: Array<Card> = [];
  indexOfCardShown = 0;
  act: ConvoCardsActivity;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.act = this.activityState.convoactivity;
    if (!isEmpty(this.act.participant_cards)) {
      this.getParticipantCards();
    } else {
      this.indexOfCardShown = 0;
      this.items = this.activityState.convoactivity.cards;
    }
  }

  getParticipantCards() {
    const participantCode = this.getParticipantCode();
    const cardIds = this.act.participant_cards[participantCode];
    if (!cardIds) {
      return;
    }
    this.items = [];
    this.act.cards.forEach((val) => {
      if (cardIds.includes(val.id)) {
        this.items.push(val);
      }
    });
  }
  ngOnChanges() {
    this.act = this.activityState.convoactivity;
    if (!isEmpty(this.act.participant_cards)) {
      this.getParticipantCards();
    }
    // set the currently selected card as selected in sharing tool
  }

  nextCard() {
    // this.items.push(this.items.shift());

    const newIndex = this.indexOfCardShown + 1;
    if (newIndex >= this.items.length) {
      this.indexOfCardShown = 0;
    } else {
      this.indexOfCardShown = newIndex;
    }

    this.notifyScreen();
  }

  previousCard() {
    const newIndex = this.indexOfCardShown - 1;
    if (newIndex === -1) {
      this.indexOfCardShown = this.items.length - 1;
    } else {
      this.indexOfCardShown = newIndex;
    }
    this.notifyScreen();
  }

  notifyScreen() {}
}
