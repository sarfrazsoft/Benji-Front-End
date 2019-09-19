import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnChanges, OnInit } from '@angular/core';
import { BrainstormRemoveSubmissionEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss']
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  constructor() {
    super();
  }
  ideas = [];

  // categories = [
  //   {
  //     name: 'Category 1',
  //     list: [
  //       'Category 1 task 1',
  //       'Category 1 task 2',
  //       'Category 1 task 3',
  //       'Category 1 task 4'
  //     ]
  //   },
  //   {
  //     name: 'Category 2',
  //     list: [
  //       'Category 2 task 1',
  //       'Category 2 task 2',
  //       'Category 2 task 3',
  //       'Category 2 task 4'
  //     ]
  //   },
  //   {
  //     name: 'Category 3',
  //     list: [
  //       'Category 3 task 1',
  //       'Category 3 task 2',
  //       'Category 3 task 3',
  //       'Category 3 task 4'
  //     ]
  //   },
  //   {
  //     name: 'Category 4',
  //     list: [
  //       'Category 4 task 1',
  //       'Category 4 task 2',
  //       'Category 4 task 3',
  //       'Category 4 task 4'
  //     ]
  //   }
  // ];

  ngOnInit() {
    console.log(this.activityState.brainstormactivity);
  }

  ngOnChanges() {
    const bsAct = this.activityState.brainstormactivity;
    this.ideas = [];
    bsAct.idea_rankings.forEach(idea => {
      this.ideas.push({ ...idea, showClose: false });
    });
    // this.ideas.sort((a, b) => b.num_votes - a.num_votes);
    console.log(this.ideas);
    // this.ideas = bsAct.idea_ranking;
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

  deleteIdea(id) {
    this.sendMessage.emit(new BrainstormRemoveSubmissionEvent(id));
  }
}

// idea_rankings: []
// instructions: "How can we take over the world?"
// max_user_submissions: 2
// max_user_votes: 3
// submission_complete: false
// submission_countdown_timer: {id: 5, status: "paused", start_time: "2019-09-17T14:39:47.275652-04:00", end_time: null, total_seconds: 90, …}
// submission_seconds: 90
// user_submission_counts: []
// user_vote_counts: []
// voting_complete: false
// voting_countdown_timer: null
// voting_seconds: 45

// this.ideas = [
//   {
//     id: 1,
//     text:
//       'Put away my phone when people are trying to have a conversation with me',
//     showClose: false
//   },
//   {
//     id: 2,
//     text: 'Be more mindful of my thoughts while in conversation',
//     showClose: false
//   },
//   {
//     id: 3,
//     text:
//       'Remember not to interrupt people while they’re' +
//       ' talking and wait till the end to ask questions',
//     showClose: false
//   },
//   { id: 40, text: 'Get rid of distractions', showClose: false },
//   { id: 41, text: 'Get rid of distractions', showClose: false },
//   { id: 42, text: 'Get rid of distractions', showClose: false },
//   { id: 43, text: 'Get rid of distractions', showClose: false },
//   {
//     id: 5,
//     text: 'Remind people to pay attention if they get distracted',
//     showClose: false
//   },
//   {
//     id: 6,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 7,
//     text: 'Be more mindful of my thoughts while in conversation',
//     showClose: false
//   },
//   {
//     id: 8,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 9,
//     text:
//       'Summarize and paraphrase what people are saying' +
//       'Summarize and paraphrase what people are saying' +
//       'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 10,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 11,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 12,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 15,
//     text:
//       'Remember not to interrupt people while they’re' +
//       'talking and wait till the end to ask questions',
//     showClose: false
//   },
//   {
//     id: 10,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 11,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 12,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 15,
//     text:
//       'Remember not to interrupt people while they’re' +
//       'talking and wait till the end to ask questions',
//     showClose: false
//   },
//   {
//     id: 10,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 11,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 12,
//     text: 'Summarize and paraphrase what people are saying',
//     showClose: false
//   },
//   {
//     id: 15,
//     text:
//       'Remember not to interrupt people while they’re' +
//       'talking and wait till the end to ask questions',
//     showClose: false
//   }
// ];
