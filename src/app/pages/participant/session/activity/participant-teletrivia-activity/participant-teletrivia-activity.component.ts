import {Component, OnInit, OnDestroy, Renderer2, Input, ViewChild, EventEmitter, Output} from '@angular/core';
import { BaseActivityComponent } from "../../../../shared/base-activity.component";
import {MatDialog} from '@angular/material';


@Component({
  selector: "app-participant-teletrivia-activity",
  templateUrl: "./participant-teletrivia-activity.component.html",
  styleUrls: ["./participant-teletrivia-activity.component.scss"]
})
export class ParticipantTeletriviaActivityComponent implements OnInit {

  public makingCircle;
  public gameStarted;
  public sharingStarted;
  public iAmInitiator;
  public questions;

  @ViewChild('kickofftemplate') initiatorModal;
  @ViewChild('endTemplate') endModal;

  @Input()
  set socketData(data) {
    const activity = data.message.activity_status;

    this.makingCircle = !activity.all_in_circle;
    this.gameStarted = activity.game_started;
    this.sharingStarted = activity.sharing_started;

    this.iAmInitiator = activity.chosen_user === data.your_identity.id;
    if (this.iAmInitiator && !this.makingCircle && !this.gameStarted) {
      this.triggerDialogue(this.initiatorModal);
    }

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

  public message: string;
  public currentQuestionIndex: number;
  public correctAnswer: string;
  public answerSelected: boolean;
  public showAnswerDetail: boolean;
  public selectedAnswerIndex: number;
  public timeRemaining: number;
  public killTimer: boolean;
  public gameStateTimerType: string;
  public answerExplanation: string;
  @Output() socketMessage = new EventEmitter<any>();
  public inCircle: boolean;


  constructor(private renderer: Renderer2, public dialog: MatDialog) {
    // this.clientIdentity = {
    //   id: 123,
    //   username: 'mockUserName1',
    //   first_name: 'Andrew',
    //   last_name: 'Thompson',
    //   email: 'fakemail@mailserver.com'
    // };
  }

  ngOnInit() {
    this.currentQuestionIndex = 0;
    this.timeRemaining = 5;
    this.gameStateTimerType = 'answerTime';
  }

  public sendReadyState() {
    console.log('component message');
    this.socketMessage.emit({
      'event': 'user_in_circle'
    });
    this.inCircle = true;
  }

  public initiateTelephone() {
    this.socketMessage.emit({'event': 'start_game'});
  }

  public openEndModal() {
    this.triggerDialogue(this.endModal);
    this.timeRemaining = 0;
  }

  public endGame() {
    this.socketMessage.emit({
      'event': 'sharing_done_button'
    });
    this.socketMessage.emit({
      'event': 'done_button'
    });
  }


  public checkAnswer(answer, element, index) {
    if (!this.answerSelected && !this.showAnswerDetail) {
      this.answerSelected = true;
      this.killTimer = true;
      this.selectedAnswerIndex = index;
      this.timeRemaining = null;
      if (answer.is_correct) {
        setTimeout(() => {
          this.renderer.addClass(element, 'b-standard-button--correct');
          this.answerExplanation = answer.explanation_text;
          this.showAnswerDetail = true;
          this.killTimer = false;
          this.timeRemaining = 3;
          this.socketMessage.emit({
            'event': 'submit_answer',
            'question_id': this.questions[this.currentQuestionIndex].id,
            'answer': answer.id

          });
          this.gameStateTimerType = 'nextQuestion';
        }, 1000);
      } else {
        setTimeout(() => {
          this.renderer.addClass(element, 'b-standard-button--incorrect');
          this.answerExplanation = answer.explanation_text;
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

  public nextQuestion() {
    if (this.currentQuestionIndex !== (this.questions.length - 1)) {
    this.killTimer = true;
    setTimeout(() => {
      this.killTimer = false;
      this.showAnswerDetail = false;
      this.selectedAnswerIndex = null;
      this.gameStateTimerType = 'answerTime';
      this.timeRemaining = 5;
      this.answerSelected = null;
        ++this.currentQuestionIndex;
      }, 100);
    }

  }

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
