import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { uniqBy } from 'lodash';
import {
  BrainstormRemoveSubmissionEvent,
  BrainstormSetCategoryEvent,
  BrainstormToggleCategoryModeEvent,
  Timer,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss'],
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  @ViewChild('colName') colNameElement: ElementRef;
  constructor() {
    super();
  }
  instructions = '';
  timer: Timer;

  submissionScreen = false;
  voteScreen = false;
  VnSComplete = false;
  categorizeFlag = false;
  colDeleted = 0;
  ideas = [];

  // todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  // columns = [
  //   {
  //     name: 'Uncategorized',
  //     list: ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'],
  //     editing: false,
  //   },
  //   {
  //     name: 'Category Two',
  //     list: [
  //       'Get up',
  //       'Brush teeth',
  //       'Take a shower',
  //       'Check e-mail',
  //       'Walk dog',
  //     ],
  //     editing: false,
  //   },
  // ];

  columns = [];

  // done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  ngOnInit() {}

  ngOnChanges() {
    const act = this.activityState.brainstormactivity;
    this.ideas = [];
    act.idea_rankings.forEach((idea) => {
      this.ideas.push({ ...idea, showClose: false });
    });
    this.ideas.sort((a, b) => b.num_votes - a.num_votes);

    this.instructions = act.instructions;

    this.categorizeFlag = act.categorize_flag;
    if (this.categorizeFlag) {
      this.populateCategories();
    }

    if (!act.submission_complete) {
      this.submissionScreen = true;
      this.voteScreen = false;
      this.VnSComplete = false;
      this.timer = act.submission_countdown_timer;
    } else if (act.voting_countdown_timer && !act.voting_complete) {
      this.voteScreen = true;
      this.submissionScreen = false;
      this.VnSComplete = false;
      this.timer = act.voting_countdown_timer;
    } else if (act.submission_complete && act.voting_complete) {
      this.VnSComplete = true;
      this.timer = this.activityState.base_activity.next_activity_start_timer;
    }
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
      this.sendCategorizeEvent(event);
    }
  }

  populateCategories() {
    const act = this.activityState.brainstormactivity;
    let categories = [];
    act.idea_rankings.forEach((idea) => {
      categories.push(idea.category.toLowerCase());
    });
    categories = uniqBy(categories, (e) => e);

    // populate the columns
    if (this.colDeleted > 0) {
      this.columns = [];
      this.colDeleted--;
    }
    categories.forEach((v) => {
      const categoryIdeas = [];
      act.idea_rankings.forEach((idea) => {
        if (idea.category.toLowerCase() === v.toLowerCase()) {
          categoryIdeas.push(idea);
        }
      });

      if (this.columns.length < categories.length) {
        this.columns.push({ name: v, editing: false, list: categoryIdeas });
      } else {
        for (let i = 0; i < this.columns.length; i++) {
          const c = this.columns[i];
          if (c.name.toLowerCase() === v.toLowerCase()) {
            this.columns[i].list = categoryIdeas;
            this.columns[i].name = v.toLowerCase();
            this.columns[i].editing = false;
          }
        }
      }
    });
  }

  sendCategorizeEvent(event) {
    console.log(event);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
      event.container.element.nativeElement.innerHTML,
      'text/html'
    );
    const colName = htmlDoc.getElementsByClassName('column-name')[0].innerHTML;

    const id = event.container.data[event.currentIndex].id;
    this.sendMessage.emit(
      new BrainstormSetCategoryEvent(id, colName.toLowerCase())
    );
  }

  deleteIdea(id) {
    this.sendMessage.emit(new BrainstormRemoveSubmissionEvent(id));
  }

  columnHeaderClicked(column) {
    column.editing = true;
    setTimeout(() => {
      this.colNameElement.nativeElement.focus();
    }, 0);
  }

  deleteCol(index) {
    this.columns[index].list.forEach((idea) => {
      this.sendMessage.emit(new BrainstormRemoveSubmissionEvent(idea.id));
      this.colDeleted++;
    });
    this.columns.splice(index, 1);
  }

  onColumnNameBlur(column) {
    column.editing = false;
  }

  addColumn() {
    this.columns.push({ name: '', list: [], editing: true });
  }
}

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
//
//
//
//
//
//
//
//
//
//
//
//
//

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
