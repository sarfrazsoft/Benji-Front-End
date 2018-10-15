import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { BaseActivityComponent } from "../../../../shared/base-activity.component";

@Component({
  selector: "app-participant-teletrivia-activity",
  templateUrl: "./participant-teletrivia-activity.component.html",
  styleUrls: ["./participant-teletrivia-activity.component.scss"]
})
export class ParticipantTeletriviaActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnDestroy {

  public questionsAnswersSet = [
    {
      question: "The answer is c",
      answers: [
        {
          isAnswer: false,
          answerValue: "Alpha"
        },
        {
          isAnswer: false,
          answerValue: "Beta"
        },
        {
          isAnswer: true,
          answerValue: "Charlie"
        }
      ],
      correctAnswerDetail: "Here are a few facts about the answer"
    },
    {
      question: "The answer is B",
      answers: [
        {
          isAnswer: false,
          answerValue: "Alpha"
        },
        {
          isAnswer: true,
          answerValue: 'Beta'
        },
        {
          isAnswer: false,
          answerValue: 'Charlie'
        }
      ],
      correctAnswerDetail: "Here are a few facts about the answer"
    },
    {
      question: 'The answer is C',
      answers: [
        {
          isAnswer: false,
          answerValue: 'Alpha'
        },
        {
          isAnswer: false,
          answerValue: 'Beta'
        },
        {
          isAnswer: true,
          answerValue: 'Charlie'
        }
      ],
      correctAnswerDetail: "Here are a few facts about the answer"
    }
  ];

  public telephoneActivityParams = {
    telephone_initiator_userId: 123,
    telephone_message: 'Do you know the way to San Jose',
    telephone_started: false
  };

  public isTelephoneInitiator: boolean;
  public message: string;
  public currentQuestionIndex: number;
  public correctAnswer: string;
  public answerSelected: boolean;
  public showAnswerDetail: boolean;
  public selectedAnswerIndex: number;
  public timeRemaining: number;
  public killTimer: boolean;
  public gameStateTimerType: string;


  constructor(private renderer: Renderer2) {
    super();
    this.clientIdentity = {
      id: 123,
      username: 'mockUserName1',
      first_name: 'Andrew',
      last_name: 'Thompson',
      email: 'fakemail@mailserver.com'
    };
  }

  ngOnInit() {
    this.currentQuestionIndex = 0;
    this.timeRemaining = 3;
    this.gameStateTimerType = 'answerTime';
  }

  ngOnDestroy() {}




  public checkAnswer(answer, element, index) {
    if(!this.answerSelected && !this.showAnswerDetail) {
      this.answerSelected = true;
      this.killTimer = true;
      this.selectedAnswerIndex = index;
      this.timeRemaining = null;
      if (answer.isAnswer) {
        setTimeout(() => {
          this.renderer.addClass(element, 'b-standard-button--correct');
          this.showAnswerDetail = true;
          this.killTimer = false;
          this.timeRemaining = 3;
          this.gameStateTimerType = 'nextQuestion';
        }, 1000);
      } else {
        setTimeout(() => {
          this.renderer.addClass(element, 'b-standard-button--incorrect');
          this.showAnswerDetail = true;
          this.killTimer = false;
          this.timeRemaining = 3;
          this.gameStateTimerType = 'nextQuestion';
        }, 1000);
      }
    }
  }

  public handleTimesUp(event) {
    console.log(event);
    if(event === 'answerTime') {
      this.killTimer = true;
      console.log('it is answer time');
      this.showAnswerDetail = true;
      setTimeout(() => {
        this.killTimer = false;
        this.timeRemaining = 3;
        this.gameStateTimerType = 'nextQuestion';
      }, 1000);
    } else if (event === 'nextQuestion') {
      this.nextQuestion();
    }
  }

  public nextQuestion(){}

  public updateScore() {}

  public numToLetter(num) {
    return 'ABCDEFGHIJK'.charAt(num - 1);
  }
}
