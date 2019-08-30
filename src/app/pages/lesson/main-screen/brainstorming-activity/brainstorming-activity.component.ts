import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss']
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit {
  ideas = [];
  constructor() {
    super();
  }

  ngOnInit() {
    this.ideas = [
      {
        id: 1,
        text:
          'Put away my phone when people are trying to have a conversation with me'
      },
      {
        id: 2,
        text: 'Be more mindful of my thoughts while in conversation'
      },
      {
        id: 3,
        text:
          'Remember not to interrupt people while they’re' +
          ' talking and wait till the end to ask questions'
      },
      { id: 40, text: 'Get rid of distractions' },
      { id: 41, text: 'Get rid of distractions' },
      { id: 42, text: 'Get rid of distractions' },
      { id: 43, text: 'Get rid of distractions' },
      { id: 5, text: 'Remind people to pay attention if they get distracted' },
      { id: 6, text: 'Summarize and paraphrase what people are saying' },
      { id: 7, text: 'Be more mindful of my thoughts while in conversation' },
      { id: 8, text: 'Summarize and paraphrase what people are saying' },
      {
        id: 9,
        text:
          'Summarize and paraphrase what people are saying' +
          'Summarize and paraphrase what people are saying' +
          'Summarize and paraphrase what people are saying'
      },
      { id: 10, text: 'Summarize and paraphrase what people are saying' },
      { id: 11, text: 'Summarize and paraphrase what people are saying' },
      { id: 12, text: 'Summarize and paraphrase what people are saying' },
      // { id: 13, text: 'Summarize and paraphrase what people are saying' },
      // { id: 14, text: 'Summarize and paraphrase what people are saying' },
      {
        id: 15,
        text:
          'Remember not to interrupt people while they’re' +
          'talking and wait till the end to ask questions'
      }
    ];
  }
}
