import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BuildAPitchService } from 'src/app/services/activities';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Card } from 'src/app/services/backend/schema/activities';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-convo-cards',
  templateUrl: './convo-cards.component.html',
})
export class ConvoCardsComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() currentSpeaker: { displayName: string; id: number };
  text = '';

  items: Array<Card> = [];
  indexOfCardShown = 0;
  constructor(private buildAPitchService: BuildAPitchService) {}

  ngOnInit(): void {
    this.indexOfCardShown = 0;
    this.items = this.activityState.convoactivity.cards;
  }

  ngOnChanges() {}

  update() {
    console.log(this.activityState);
    const share = this.activityState.running_tools.share;
    if (share && share.convoCard && share.convoCard.selectedCard) {
      this.indexOfCardShown = this.findIndexOfSelectedCard(share.convoCard.selectedCard);
    }
  }

  findIndexOfSelectedCard(cardId: number): number {
    const cards = this.items;
    for (let i = 0; i < this.items.length; i++) {
      if (cards[i].id === cardId) {
        return i;
      }
    }
    return 0;
  }
}
