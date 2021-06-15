import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import * as fromStore from '../../../store';

@Component({
  selector: 'benji-selector-activity',
  templateUrl: './activity.component.html',
})
export class ActivityComponent implements OnInit, OnDestroy {
  @Input() activity;
  hover = false;
  imgSrc = '';
  hostname = window.location.protocol + '//' + environment.host;
  selectedPossibleActivity = '';
  sub: Subscription;
  selectedActivity$: Subscription;
  selectedActivity;
  dialogRef;
  constructor(private store: Store<fromStore.EditorState>, private matDialog: MatDialog) {}

  ngOnInit() {
    // this.activities$ = this.store.select(fromStore.getAllPossibleActivities);
    this.sub = this.store.select(fromStore.getSelectedPossibleActivity).subscribe((val) => {
      this.selectedPossibleActivity = val;
    });

    this.selectedActivity$ = this.store.select(fromStore.getSelectedLessonActivity).subscribe((val) => {
      this.selectedActivity = val;
    });
  }
  getThumbnailSrc(activity) {
    if (activity.thumbnail) {
      return this.hostname + activity.thumbnail;
    }
  }

  selectActivity(activityId) {
    if (this.selectedPossibleActivity) {
      if (this.selectedPossibleActivity === activityId) {
        return;
      } else {
        const msg = 'Are you sure you want to overwrite the existing activity?';
        this.dialogRef = this.matDialog
          .open(ConfirmationDialogComponent, {
            data: {
              confirmationMessage: msg,
              actionButton: 'Overwrite',
            },
            disableClose: true,
            panelClass: 'dashboard-dialog',
          })
          .afterClosed()
          .subscribe((res) => {
            console.log(res);
            if (res) {
              this.store.dispatch(new fromStore.SelectActivityType(activityId));
            }
          });
      }
    } else {
      this.store.dispatch(new fromStore.SelectActivityType(activityId));
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  mouseEnter(activityId) {
    if (this.selectedActivity.empty) {
      if (this.selectedPossibleActivity) {
        if (this.selectedPossibleActivity === activityId) {
          return;
        } else {
          this.store.dispatch(new fromStore.SelectActivityType(activityId));
        }
      } else {
        this.store.dispatch(new fromStore.SelectActivityType(activityId));
      }
    }
  }

  mouseLeave(activityId) {
    console.log(this.selectedActivity);
    // empty that lessonActivity
    this.store.dispatch(new fromStore.SetLessonActivityEmpty(this.selectedActivity.id));
  }
}

// export const page = {
//   title: 'page title',
//   backgroundImage: 'path/to/image',
//   owner: 3,
//   content: [
//     {
//       type: 'editorContent',
//       data: `{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"user A created this worksheet "}]},{"type":"paragraph","attrs":{"align":null},"content":[{"type":"image","attrs":{"src":"http://localhost/media/881d457a9fd275b352fd495d6e75464d_dSYaYIu.jpg","alt":null,"title":null,"width":null}}]}]}`,
//     },
//     {
//       type: 'mcqActivity',
//       data: mcqActivityData,
//     },
//     {
//       type: 'editorContent',
//       data: `{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"user A created this worksheet "}]},{"type":"paragraph","attrs":{"align":null},"content":[{"type":"image","attrs":{"src":"http://localhost/media/881d457a9fd275b352fd495d6e75464d_dSYaYIu.jpg","alt":null,"title":null,"width":null}}]}]}`,
//     },
//   ],
// };
