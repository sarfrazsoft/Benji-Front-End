import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
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
  constructor() {
    super();
  }
  ideas = [];

  categories = [
    {
      name: 'Category 1',
      list: [
        'Category 1 task 1',
        'Category 1 task 2',
        'Category 1 task 3',
        'Category 1 task 4'
      ]
    },
    {
      name: 'Category 2',
      list: [
        'Category 2 task 1',
        'Category 2 task 2',
        'Category 2 task 3',
        'Category 2 task 4'
      ]
    },
    {
      name: 'Category 3',
      list: [
        'Category 3 task 1',
        'Category 3 task 2',
        'Category 3 task 3',
        'Category 3 task 4'
      ]
    },
    {
      name: 'Category 4',
      list: [
        'Category 4 task 1',
        'Category 4 task 2',
        'Category 4 task 3',
        'Category 4 task 4'
      ]
    }
  ];

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
      {
        id: 15,
        text:
          'Remember not to interrupt people while they’re' +
          'talking and wait till the end to ask questions'
      }
    ];
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
