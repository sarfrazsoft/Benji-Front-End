import { Component, OnChanges, OnInit } from '@angular/core';
import { ConvoCardsActivity } from 'src/app/services/backend/schema/activities';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-convo-cards-activity',
  templateUrl: './convo-cards-activity.component.html',
  styleUrls: ['./convo-cards-activity.component.scss'],
})
export class ParticipantConvoCardsActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  items = CARDS;
  indexOfCardShown = 0;
  constructor() {
    super();
  }

  ngOnInit(): void {
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
}

const CARDS = [
  {
    emoji: 'emoji://1F606',
    main: '1If you were a food, what would you be?',
    sub: 'This is just a silly exercise, don’t over think it!',
  },
  {
    emoji: 'emoji://1F606',
    main: '2If you were a food, what would you be?',
    sub:
      'This is just a silly exercise, don’t over think it! This is just a silly exercise, don’t over think it!',
  },
  {
    emoji: 'emoji://1F606',
    main: '3If you were a food, what would you be?',
    sub: 'This is just a silly exercise, don’t over think it!',
  },
];
