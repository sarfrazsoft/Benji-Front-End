import { Component, OnChanges, OnInit } from '@angular/core';
import { ParticipantSelectCardEvent } from 'src/app/services/backend/schema';
import { Card, ConvoCardsActivity } from 'src/app/services/backend/schema/activities';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-convo-cards-activity',
  templateUrl: './convo-cards-activity.component.html',
})
export class ParticipantConvoCardsActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  items: Array<Card> = [];
  indexOfCardShown = 0;
  constructor() {
    super();
  }

  ngOnInit(): void {
    // console.log(this.activityState);
    this.indexOfCardShown = 0;
    this.items = this.activityState.convoactivity.cards;
    // this.activityState.convocardsactivity
    // const c: ConvoCardsActivity;
  }
  ngOnChanges() {
    // set the currently selected card as selected in sharing tool
    const tools = this.activityState.running_tools;
    if (tools && tools.share) {
      if (tools.share.selectedParticipant && this.getParticipantCode() === tools.share.selectedParticipant) {
        if (tools.share.convoCard.selectedCard !== this.items[this.indexOfCardShown].id) {
          // send event only if selectedCard on mainscreen is not the same as user's
          // selectedcard on the phone
          this.sendMessage.emit(new ParticipantSelectCardEvent(this.items[this.indexOfCardShown].id));
        }
      }
    }

    this.timer = this.getTimerTool();
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

  notifyScreen() {
    const tools = this.activityState.running_tools;
    if (tools && tools.share) {
      if (tools.share.selectedParticipant && this.getParticipantCode() === tools.share.selectedParticipant) {
        this.sendMessage.emit(new ParticipantSelectCardEvent(this.items[this.indexOfCardShown].id));
      }
    }
  }
}
