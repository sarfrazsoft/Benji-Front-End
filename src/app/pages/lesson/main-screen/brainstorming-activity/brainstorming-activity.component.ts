import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { uniqBy } from "lodash";
import { Observable, Subscription } from "rxjs";
import { BrainStormComponent } from "src/app/dashboard/past-sessions/reports";
import { ContextService } from "src/app/services";
import {
  BrainstormActivity,
  BrainstormCreateCategoryEvent,
  BrainstormRemoveCategoryEvent,
  BrainstormRemoveSubmissionEvent,
  BrainstormRenameCategoryEvent,
  BrainstormSetCategoryEvent,
  BrainstormSubmitEvent,
  BrainstormToggleCategoryModeEvent,
  Idea,
  Timer,
} from "src/app/services/backend/schema";
import { BaseActivityComponent } from "../../shared/base-activity.component";

import { MatDialog } from "@angular/material";
import { ImageViewDialogComponent } from "src/app/pages";

@Component({
  selector: "benji-ms-brainstorming-activity",
  templateUrl: "./brainstorming-activity.component.html",
  styleUrls: ["./brainstorming-activity.component.scss"],
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  @ViewChild("colName") colNameElement: ElementRef;
  @Input() peakBackState = false;
  @Input() activityStage: Observable<string>;
  peakBackStage = null;
  private eventsSubscription: Subscription;

  constructor(
    private contextService: ContextService,
    private dialog: MatDialog
  ) {
    super();
  }
  instructions = "";
  timer: Timer;
  act: BrainstormActivity;

  submissionScreen = false;
  voteScreen = false;
  VnSComplete = false;
  categorizeFlag = false;
  colDeleted = 0;
  joinedUsers = [];
  ideaSubmittedUsersCount = 0;
  voteSubmittedUsersCount = 0;
  ideas = [];
  hostname = window.location.protocol + "//" + window.location.hostname;
  dialogRef;

  columns = [];

  imagesURLs = [
    "localhost/media/Capture_LGXPk9s.JPG",
    "localhost/media/Capture_LGXPk9s.JPG",
    "../../../../../assets//img/Desk_lightblue2.jpg",
  ];
  ngOnInit() {
    this.act = this.activityState.brainstormactivity;
    if (this.peakBackState) {
      this.eventsSubscription = this.activityStage.subscribe((state) =>
        this.changeStage(state)
      );
    }
  }
  ngOnDestroy() {
    if (this.peakBackState) {
      this.eventsSubscription.unsubscribe();
    }
  }
  changeStage(state) {
    this.peakBackStage = state;
    const act = this.activityState.brainstormactivity;
    if (state === "next") {
    } else {
      // state === 'previous'
    }

    if (this.submissionScreen) {
      if (state === "next") {
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      } else {
        // state === 'previous'
        // do nothing
      }
    } else if (this.voteScreen) {
      if (state === "next") {
        this.submissionScreen = false;
        this.voteScreen = false;
        this.VnSComplete = true;
      } else {
        // state === 'previous'
        this.submissionScreen = true;
        this.voteScreen = false;
        this.VnSComplete = false;
        this.ideaSubmittedUsersCount = this.getIdeaSubmittedUsersCount(act);
      }
    } else if (this.VnSComplete) {
      if (state === "next") {
        // do nothing
      } else {
        // state === 'previous'
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      }
    }
  }

  ngOnChanges() {
    const act = this.activityState.brainstormactivity;
    this.act = this.activityState.brainstormactivity;
    this.joinedUsers = this.activityState.lesson_run.joined_users;
    this.ideas = [];
    act.brainstormcategory_set.forEach((category) => {
      if (!category.removed) {
        category.brainstormidea_set.forEach((idea: Idea) => {
          if (!idea.removed) {
            this.ideas.push({ ...idea, showClose: false });
          }
        });
      }
    });
    // act.idea_rankings.forEach((idea) => {
    //   this.ideas.push({ ...idea, showClose: false });
    // });
    this.ideas.sort((a, b) => b.num_votes - a.num_votes);

    this.instructions = act.instructions;

    this.categorizeFlag = act.categorize_flag;
    if (this.categorizeFlag) {
      this.populateCategories();
    }

    if (this.peakBackState && this.peakBackStage === null) {
      this.voteScreen = true;
      this.submissionScreen = false;
      this.VnSComplete = false;
      this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
    } else if (!this.peakBackState) {
      if (!act.submission_complete) {
        this.submissionScreen = true;
        this.voteScreen = false;
        this.VnSComplete = false;
        this.timer = act.submission_countdown_timer;
        this.contextService.activityTimer = act.submission_countdown_timer;
        this.ideaSubmittedUsersCount = this.getIdeaSubmittedUsersCount(act);
      } else if (act.voting_countdown_timer && !act.voting_complete) {
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.timer = act.voting_countdown_timer;
        this.contextService.activityTimer = act.voting_countdown_timer;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      } else if (act.submission_complete && act.voting_complete) {
        this.submissionScreen = false;
        this.voteScreen = false;
        this.VnSComplete = true;
        this.timer = this.activityState.base_activity.next_activity_start_timer;
        this.contextService.activityTimer = this.timer;
      }
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
    act.brainstormcategory_set.forEach((category) => {
      category.brainstormidea_set.forEach((idea) => {
        idea = { ...idea, showClose: false, editing: false, addingIdea: false };
      });
    });
  }

  getIdeaSubmittedUsersCount(act: BrainstormActivity) {
    return act.user_submission_counts.length;
  }

  getVoteSubmittedUsersCount(act: BrainstormActivity) {
    return act.user_vote_counts.length;
  }

  sendCategorizeEvent(event) {
    const id = event.container.data[event.currentIndex].id;
    let categoryId;
    this.act.brainstormcategory_set.forEach((cat) => {
      cat.brainstormidea_set.forEach((idea) => {
        if (idea.id === id) {
          categoryId = cat.id;
        }
      });
    });
    this.sendMessage.emit(new BrainstormSetCategoryEvent(id, categoryId));
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

  addIdea(column) {
    column.addingIdea = true;
  }

  deleteCol(categoryId) {
    this.sendMessage.emit(new BrainstormRemoveCategoryEvent(categoryId, true));
  }

  onColumnNameBlur(column) {
    this.sendMessage.emit(
      new BrainstormRenameCategoryEvent(column.id, column.category_name)
    );
    column.editing = false;
  }

  saveNewIdea(column, text) {
    column.addingIdea = false;
    this.sendMessage.emit(new BrainstormSubmitEvent(text, column.id));
  }

  addColumn(newCategoryNumber) {
    this.sendMessage.emit(
      new BrainstormCreateCategoryEvent("Category " + newCategoryNumber)
    );
  }

  viewImage(imageUrl: string) {
    this.dialogRef = this.dialog
      .open(ImageViewDialogComponent, {
        data: { imageUrl: imageUrl },
        disableClose: false,
        panelClass: "image-view-dialog",
      })
      .afterClosed()
      .subscribe((res) => {});
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
