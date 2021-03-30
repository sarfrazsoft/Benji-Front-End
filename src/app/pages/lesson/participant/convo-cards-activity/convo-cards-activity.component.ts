import { Component, OnChanges, OnInit } from '@angular/core';
import { ConvoCardsActivity } from 'src/app/services/backend/schema/activities';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-convo-cards-activity',
  templateUrl: './convo-cards-activity.component.html',
})
export class ParticipantConvoCardsActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  items = [];
  indexOfCardShown = 0;
  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.activityState);
    this.indexOfCardShown = 0;
    this.items = this.activityState.convoactivity.cards;
    // this.activityState.convocardsactivity
    // const c: ConvoCardsActivity;
  }
  ngOnChanges() {}

  nextCard() {
    // this.items.push(this.items.shift());
    const newIndex = this.indexOfCardShown + 1;
    if (newIndex >= this.items.length) {
      this.indexOfCardShown = 0;
    } else {
      this.indexOfCardShown = newIndex;
    }
  }

  previousCard() {
    const newIndex = this.indexOfCardShown - 1;
    if (newIndex === -1) {
      this.indexOfCardShown = this.items.length - 1;
    } else {
      this.indexOfCardShown = newIndex;
    }
  }
}
