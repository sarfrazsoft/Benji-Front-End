import { Component, OnChanges, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
import {
  CurrentRoundDetails,
  MontyHallActivity,
  MontyHallSelectDoorEvent,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-monty-hall-activity',
  templateUrl: './monty-hall-activity.component.html',
  styleUrls: ['./monty-hall-activity.component.scss'],
})
export class ParticipantMontyHallActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  act: MontyHallActivity;
  doors = [{ id: 1 }, { id: 2 }, { id: 3 }];
  selectedDoor = { id: null };
  choiceSubmitted = false;
  showDoorSubmitButton = false;
  userWon = false;

  // screens
  initialChoiceScreen = false;
  changeChoiceScreen = false;
  revealScreen = false;
  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    this.act = this.activityState.montyhallactivity;
    if (this.act.status === 'initial_choice') {
      this.contextService.activityTimer = this.act.initial_choice_timer;
      this.initialChoiceScreen = true;
      this.changeChoiceScreen = false;
      this.revealScreen = false;
      if (this.hasUserMadeChoice()) {
        this.choiceSubmitted = true;
        this.selectedDoor = { id: this.getUserInitialPickedDoor() };
      } else {
        this.choiceSubmitted = false;
        this.selectedDoor = { id: null };
      }
      this.userWon = false;
    } else if (this.act.status === 'change_choice') {
      this.contextService.activityTimer = this.act.change_choice_timer;
      this.choiceSubmitted = false;
      if (this.hasUserPickedAgain()) {
        this.choiceSubmitted = true;
      }
      this.selectedDoor = { id: null };
      this.changeChoiceScreen = true;
      this.initialChoiceScreen = false;
      this.revealScreen = false;
      this.userWon = false;
    } else if (this.act.status === 'reveal') {
      this.contextService.activityTimer = this.act.reveal_timer;
      this.revealScreen = true;
      this.initialChoiceScreen = false;
      this.changeChoiceScreen = false;
      if (this.isUserWinner()) {
        this.userWon = true;
      }
    } else if (this.act.status === 'results') {
      this.contextService.activityTimer = this.act.results_timer;
      this.revealScreen = true;
      this.initialChoiceScreen = false;
      this.changeChoiceScreen = false;
      if (this.isUserWinner()) {
        this.userWon = true;
      }
    }
  }

  hasUserMadeChoice() {
    const userid = this.myParticipantCode;
    const userChoice: Array<CurrentRoundDetails> = this.act.current_round_details.filter(
      (u) => u.participant.participant_code === userid
    );
    return userChoice[0].door_choice;
  }

  hasUserPickedAgain() {
    const userid = this.myParticipantCode;
    const userChoice: Array<CurrentRoundDetails> = this.act.current_round_details.filter(
      (u) => u.participant.participant_code === userid
    );
    if (userChoice[0].changed_choice === null) {
      return false;
    } else {
      return true;
    }
  }

  getUserInitialPickedDoor() {
    const userid = this.myParticipantCode;
    const userChoice: Array<CurrentRoundDetails> = this.act.current_round_details.filter(
      (u) => u.participant.participant_code === userid
    );
    if (userChoice.length) {
      return userChoice[0].door_choice;
    }
  }

  revealedDoor() {
    const userid = this.myParticipantCode;
    const userChoice: Array<CurrentRoundDetails> = this.act.current_round_details.filter(
      (u) => u.participant.participant_code === userid
    );
    return userChoice[0].door_reveal;
  }

  getUsersOtherAvailableChoice() {
    if (this.getUserInitialPickedDoor() === 1) {
      if (this.revealedDoor() === 2) {
        return 3;
      } else {
        return 2;
      }
    } else if (this.getUserInitialPickedDoor() === 2) {
      if (this.revealedDoor() === 3) {
        return 1;
      } else {
        return 3;
      }
    } else if (this.getUserInitialPickedDoor() === 3) {
      if (this.revealedDoor() === 1) {
        return 2;
      } else {
        return 1;
      }
    }
    console.log('x');
  }

  selectDoor(door) {
    if (!this.choiceSubmitted) {
      this.selectedDoor = door;
      this.showDoorSubmitButton = true;
    }
  }

  isUserWinner() {
    const userid = this.myParticipantCode;
    const userChoice: Array<CurrentRoundDetails> = this.act.current_round_details.filter(
      (u) => u.participant.participant_code === userid
    );
    return userChoice[0].door_choice === userChoice[0].correct_door;
  }

  submitDoor() {
    if (this.selectedDoor.id && !this.choiceSubmitted) {
      this.sendMessage.emit(new MontyHallSelectDoorEvent(this.selectedDoor.id));
      this.choiceSubmitted = true;
      this.showDoorSubmitButton = false;
    }
  }
}
