import {
  Component,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  TeleTriviaMessageReturnedEvent,
  TeleTriviaSharingDoneEvent,
  TeleTriviaStartGameEvent,
  TeleTriviaSubmitAnswerEvent,
  TeleTriviaUserInCircleEvent
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-teletrivia-activity',
  templateUrl: './teletrivia-activity.component.html',
  styleUrls: ['./teletrivia-activity.component.scss']
})
export class ParticipantTeletriviaActivityComponent
  extends BaseActivityComponent
  implements OnChanges, OnDestroy {
  constructor(private renderer: Renderer2, public dialog: MatDialog) {
    super();
  }
  currentQuestionIndex = 0;

  msessageShared = false;
  revealAnswer = false;
  answerExplanation: string;
  selectedAnswerIndex;

  initiatorModalVisible = false;

  @ViewChild('questionTimer') questionTimer;
  @ViewChild('revealTimer') revealTimer;

  @ViewChild('kickofftemplate') initiatorModal;
  @ViewChild('endTemplate') endModal;

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  startQuestionTimer(timer) {
    timer.startTimer(5);
  }

  startRevealTimer(timer) {
    timer.startTimer(3);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.participantIsInitiator() &&
      !this.activityState.teletriviaactivity.game_started &&
      this.activityState.teletriviaactivity.circle_complete &&
      !this.initiatorModalVisible
    ) {
      this.initiatorModalVisible = true;
      this.triggerDialogue(this.initiatorModal);
    }

    if (this.activityState.teletriviaactivity.sharing_started) {
      if (this.questionTimer && this.questionTimer.running) {
        this.questionTimer.stopTimer();
      }
      if (this.revealTimer && this.revealTimer.running) {
        this.revealTimer.stopTimer();
      }
    }
  }

  public openEndModal() {
    this.triggerDialogue(this.endModal);
    this.sendMessage.emit(new TeleTriviaMessageReturnedEvent());
  }

  participantInCircle() {
    return (
      this.activityState.teletriviaactivity.users_in_circle.find(
        e => e.id === this.activityState.your_identity.id
      ) !== undefined
    );
  }

  participantIsInitiator() {
    return (
      this.activityState.teletriviaactivity.first_user_in_chain.id ===
      this.activityState.your_identity.id
    );
  }

  sendReadyState() {
    this.sendMessage.emit(new TeleTriviaUserInCircleEvent());
  }

  public initiateTelephone() {
    this.sendMessage.emit(new TeleTriviaStartGameEvent());
  }

  public endGame() {
    this.sendMessage.emit(new TeleTriviaSharingDoneEvent());
  }

  questionTimeUpCallback() {
    this.revealAnswer = true;
    this.answerExplanation =
      'On no! You ran out of time! This was the correct answer.';
  }

  submitAnswer(choice) {
    this.questionTimer.stopTimer(false);

    const question = this.activityState.teletriviaactivity.questions[
      this.currentQuestionIndex
    ];
    this.sendMessage.emit(new TeleTriviaSubmitAnswerEvent(question, choice));
    this.selectedAnswerIndex = choice.id;
    this.revealAnswer = true;
    this.answerExplanation = choice.explanation;
  }

  submitAnswerCallback() {
    this.selectedAnswerIndex = null;
    this.revealAnswer = false;
    this.currentQuestionIndex++;
  }

  public triggerDialogue(templateRef) {
    this.dialog.open(templateRef, {
      width: '305px',
      panelClass: 'dialog--indigo-blue'
    });
  }
}
