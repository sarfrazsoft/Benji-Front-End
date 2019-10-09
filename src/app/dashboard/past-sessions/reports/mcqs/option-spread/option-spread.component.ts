import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-mcq-option-spread',
  templateUrl: './option-spread.component.html',
  styleUrls: ['./option-spread.component.scss']
})
export class OptionSpreadComponent implements OnInit, OnChanges {
  @Input() data: any = {};
  ratingLevels = ratingLevels;
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    // if is is ranking question data (assessments)
    if (this.data.assessments) {
      console.log(this.data.assessments);
    }
  }
}

// Rating levels for questions with 5 levels
const ratingLevels = [
  { rating: 1, name: 'strongly disagree' },
  { rating: 2, name: 'disagree' },
  { rating: 3, name: 'neutral' },
  { rating: 4, name: 'agree' },
  { rating: 5, name: 'strongly agree' }
];

// Rating levels for questions with 3 levels
const ratingLevels2 = [
  { rating: 1, name: 'disagree' },
  { rating: 2, name: 'neutral' },
  { rating: 3, name: 'agree' }
];
