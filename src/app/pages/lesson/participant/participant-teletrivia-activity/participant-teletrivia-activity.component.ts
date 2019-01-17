import {Component, Renderer2, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material';
import {BaseActivityComponent} from '../../shared/base-activity.component';


@Component({
  selector: 'app-participant-teletrivia-activity',
  templateUrl: './participant-teletrivia-activity.component.html',
  styleUrls: ['./participant-teletrivia-activity.component.scss']
})
export class ParticipantTeletriviaActivityComponent extends BaseActivityComponent implements OnChanges {

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

  constructor(private renderer: Renderer2, public dialog: MatDialog) {
    super();
  }

  startQuestionTimer(timer) {
    timer.startTimer(5);
  }

  startRevealTimer(timer) {
    timer.startTimer(3);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.participantIsInitiator() &&
            !this.activityState.activity_status.game_started &&
            this.activityState.activity_status.all_in_circle &&
            !this.initiatorModalVisible) {
            this.initiatorModalVisible = true;
      this.triggerDialogue(this.initiatorModal);
    }

    if (this.activityState.activity_status.sharing_started) {
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
    this.sendMessage.emit({'event': 'done_button'});
  }

  participantInCircle() {
    return this.activityState.activity_status.users_in_circle.find((e) =>
                                      e === this.activityState.your_identity.id) !== undefined;
  }

  participantIsInitiator() {
    return this.activityState.activity_status.chosen_user === this.activityState.your_identity.id;
  }

  sendReadyState() {
    this.sendMessage.emit({'event': 'user_in_circle'});
  }

  public initiateTelephone() {
    this.sendMessage.emit({'event': 'start_game'});
  }

  public endGame() {
    this.sendMessage.emit({'event': 'sharing_done_button'});
  }

  questionTimeUpCallback() {
    this.revealAnswer = true;
    this.answerExplanation = 'On no! You ran out of time! This was the correct answer.';
  }

  submitAnswer(choice) {
    this.questionTimer.stopTimer(false);

    const question = this.activityState.activity_status.distracting_questions[this.currentQuestionIndex];
    this.sendMessage.emit({'event': 'submit_answer', 'question_id': question.id, 'answer': choice.id});
    this.selectedAnswerIndex = choice.id;
    this.revealAnswer = true;
    this.answerExplanation = choice.explanation_text;
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
