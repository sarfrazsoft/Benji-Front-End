import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PastSessionsService } from 'src/app/dashboard/past-sessions/services/past-sessions.service';

@Component({
  selector: 'benji-assessment-bar',
  templateUrl: './assessment-bar.component.html',
  styleUrls: ['./assessment-bar.component.scss']
})
export class AssessmentBarComponent implements OnInit {
  questionSet: Array<any> = [];
  scale = [['25', '50', '75', '100'], ['25', '50', '75', '100']];
  scores = [
    [
      { width: 0, score: 0, class: 'bg-primary-color-lighter' },
      { width: 0, score: 0, class: 'bg-primary-color-light' },
      { width: 0, score: 0, class: 'bg-primary-color' },
      { width: 0, score: 0, class: 'bg-primary-color-dark' },
      { width: 0, score: 0, class: 'bg-secondary-color-dark' }
    ],
    [
      { width: 0, score: 0, class: 'bg-primary-color-lighter' },
      { width: 0, score: 0, class: 'bg-primary-color-light' },
      { width: 0, score: 0, class: 'bg-primary-color' },
      { width: 0, score: 0, class: 'bg-primary-color-dark' },
      { width: 0, score: 0, class: 'bg-secondary-color-dark' }
    ]
  ];
  legend = [
    { text: 'strongly disagree', color: 'bg-primary-color-lighter' },
    { text: 'disagree', color: 'bg-primary-color-light' },
    { text: 'neutral', color: 'bg-primary-color' },
    { text: 'agree', color: 'bg-primary-color-dark' },
    { text: 'strongly agree', color: 'bg-secondary-color-dark' }
  ];
  levels1 = [
    'strongly disagree',
    'disagree',
    'neutral',
    'agree',
    'strongly agree'
  ];
  levels1_1 = [1, 2, 3, 4, 5];
  levels2 = ['disagree', 'neutral', 'agree'];
  levels2_1 = [1, 2, 3];

  assessments = [];

  constructor(private pastSessionsService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionsService.getReports('73103').subscribe(res => {
      console.log(res);
      this.questionSet = res.feedbackquestion_set;
      console.log(this.questionSet);
      this.calculateRating();
    });
  }

  calculateRating(): void {
    this.questionSet[0] = question1;
    this.questionSet[1] = question2;
    this.questionSet.forEach((question, questionIndex) => {
      console.log(question);
      const arr = [];
      this.levels1.forEach(val => {
        arr.push(0);
      });
      question.feedbackuseranswer_set.forEach(ans => {
        const idx = this.levels1_1.findIndex(val => ans.rating_answer === val);
        arr[idx] = arr[idx] + 1;
      });
      const sum = arr.reduce((a, b) => a + b, 0);
      arr.forEach((n, i) => {
        let scoreOnScale;
        scoreOnScale = (n / sum) * 100;
        scoreOnScale = Math.round(scoreOnScale * 10) / 10;
        this.scores[questionIndex][i].score = scoreOnScale;
      });
      console.log(arr);
      console.log(this.scores);
    });
  }
}

const question1 = {
  average_rating: '3.50',
  combo_text: 'Why is that?',
  feedbackactivity: 529,
  question_text: 'What I learned in this session will improve my skills.',
  feedbackuseranswer_set: [
    { rating_answer: 3, text_answer: '3', feedbackquestion: 92 },
    { rating_answer: 4, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 4, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 }
  ]
};

const question2 = {
  average_rating: '3.50',
  combo_text: 'Why is that?',
  feedbackactivity: 529,
  question_text: 'I found this session fun',
  feedbackuseranswer_set: [
    { rating_answer: 1, text_answer: '3', feedbackquestion: 92 },
    { rating_answer: 1, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 5, text_answer: '4', feedbackquestion: 92 }
  ]
};
// average_rating: "3.50"
// combo_text: "Why is that?"
// feedbackactivity: 529
// feedbackuseranswer_set: Array(2)
// 0: {user: {…}, rating_answer: 3, text_answer: "3", feedbackquestion: 92}
// 1: {user: {…}, rating_answer: 4, text_answer: "4", feedbackquestion: 92}
// length: 2
// __proto__: Array(0)
// id: 92
// is_combo: true
// pitchomaticactivity: null
// question_text: "What I learned in this session will improve my skills."
// question_type: "rating_agreedisagree"
