import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-mcqs',
  templateUrl: './mcqs.component.html',
  styleUrls: ['./mcqs.component.scss']
})
export class McqsComponent implements OnInit, OnChanges {
  questions = [question3, question4];
  ratingLevels = ratingLevels2;
  @Input() mcqs = {};
  participants = [];
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.mcqs.joined_users) {
      this.participants = this.mcqs.joined_users.map(a => {
        return { name: a.first_name + ' ' + a.last_name, id: a.id };
      });
    }
  }

  getColumnHeaders(mcq) {
    const columnHeaderMap = {};
    mcq.question.mcqchoice_set.forEach((q, i) => {
      columnHeaderMap['option' + (i + 1)] = q.choice_text;
    });
    return columnHeaderMap;
  }
}

// question with 5 options
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

// question with 3 options
const question3 = {
  average_rating: '3.50',
  combo_text: 'Why is that?',
  feedbackactivity: 529,
  question_text: 'What I learned in this session will improve my skills.',
  feedbackuseranswer_set: [
    { rating_answer: 1, text_answer: '3', feedbackquestion: 92 },
    { rating_answer: 1, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 2, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 }
  ]
};

const question4 = {
  average_rating: '3.50',
  combo_text: 'Why is that?',
  feedbackactivity: 529,
  question_text: 'I found this session fun',
  feedbackuseranswer_set: [
    { rating_answer: 1, text_answer: '3', feedbackquestion: 92 },
    { rating_answer: 1, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 1, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 2, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 },
    { rating_answer: 3, text_answer: '4', feedbackquestion: 92 }
  ]
};

const ratingLevels = [
  { rating: 1, name: 'strongly disagree' },
  { rating: 2, name: 'disagree' },
  { rating: 3, name: 'neutral' },
  { rating: 4, name: 'agree' },
  { rating: 5, name: 'strongly agree' }
];
const ratingLevels2 = [
  { rating: 1, name: 'disagree' },
  { rating: 2, name: 'neutral' },
  { rating: 3, name: 'agree' }
];
