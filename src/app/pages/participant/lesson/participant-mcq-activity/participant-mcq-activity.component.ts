import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-participant-mcq-activity",
  templateUrl: "./participant-mcq-activity.component.html",
  styleUrls: ["./participant-mcq-activity.component.scss"]
})
export class ParticipantMcqActivityComponent implements OnInit {
  @Input()
  set socketData(data) {
    const activity = data.message.activity_status;
    const questionTimer = activity.countdown_time;
    const nextPhaseTimer = activity.pause_time;

    if (nextPhaseTimer === null) {
      this.question = activity.question.question;
      this.answerSet = activity.question.choices;
      this.correctAnswerExplanation = this.getExplanation(this.answerSet);
      this.gameStateTimerType = "questionTime";
      if(!this.timeStarted) {
        this.timeRemaining = (Date.parse(questionTimer) - Date.now()) / 1000;
        this.timeStarted = true;
      }
    }

    if (nextPhaseTimer !== null && !this.answerDetailState) {
      this.revealAnswer = true;
      setTimeout(() => {
        const scope = this;
        this.answerDetailState = true;
        this.timeRemaining = (Date.parse(nextPhaseTimer) - Date.now()) / 1000;
      }, 3100);
    }
  }

  constructor() {}

  public question;
  public answerSet;
  public correctAnswerExplanation;
  public revealAnswer;
  public answerDetailState;
  public gameStateTimerType;
  public selectedAnswerIndex;
  public timeRemaining;
  public correctAnswer;
  private timeStarted;
  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {}

  public selectAnswer(answer, event, index) {
    if (this.selectedAnswerIndex === undefined) {
      this.selectedAnswerIndex = index;
      this.socketMessage.emit({
        event: "submit_answer",
        answer: answer.id
      });
    }
  }

  public handleTimesUp(event) {
    if (event === "questionTime") {
      this.revealAnswer = true;
    }
  }

  private getExplanation(answerSet) {
    const correctObject = answerSet.find(function(choiceObject) {
      return choiceObject.is_correct === true;
    });
    this.correctAnswer = correctObject;
    return correctObject.explanation_text;
  }
}
