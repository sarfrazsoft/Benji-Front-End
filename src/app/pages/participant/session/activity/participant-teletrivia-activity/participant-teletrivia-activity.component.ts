import {Component, OnInit, OnDestroy, Renderer2, Input} from '@angular/core';
import { BaseActivityComponent } from "../../../../shared/base-activity.component";
import {MatDialog} from '@angular/material';


@Component({
  selector: "app-participant-teletrivia-activity",
  templateUrl: "./participant-teletrivia-activity.component.html",
  styleUrls: ["./participant-teletrivia-activity.component.scss"]
})
export class ParticipantTeletriviaActivityComponent implements OnInit {

  @Input()
  set socketData(data) {
    const activity = data.message.activity_status;

    this.makingCircle = !activity.game_started;
    this.gameStarted = activity.game_started;
    this.sharingStarted = activity.sharing_started;

    this.iAmInitiator = activity.chosen_user === data.message.your_identity.id;

    this.questions = activity.distracting_questions;
    /*Format: [{
        "id": 0,
        "question": "Is \"Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo.\" a grammatically correct sentence?",
        "choices": [{
          "id": 0,
          "choice_text": "Yes",
          "is_correct": true,
          "explanation_text": "Buffalo!"
        }, {
          "id": 1,
          "choice_text": "No",
          "is_correct": false,
          "explanation_text": "Buffalo :("
        }, {
          "id": 2,
          "choice_text": "Buffalo",
          "is_correct": false,
          "explanation_text": "Buffalo :("
        }]
      } */
  }

  public makingCircle;
  public gameStarted;
  public sharingStarted;
  public iAmInitiator;
  public questions;



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

  public isTelephoneInitiator = true;
  public message: string;
  public currentQuestionIndex: number;
  public correctAnswer: string;
  public answerSelected: boolean;
  public showAnswerDetail: boolean;
  public selectedAnswerIndex: number;
  public timeRemaining: number;
  public killTimer: boolean;
  public gameStateTimerType: string;


  constructor(private renderer: Renderer2, public dialog: MatDialog) {
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

  public triggerDialogue(templateRef) {
    this.dialog.open(templateRef, {
      width: '305px',
      panelClass: 'dialog--indigo-blue'
    });
  }
}
