import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinct, filter, flatMap, map, tap } from 'rxjs/operators';
import { TeamUser } from 'src/app/services/backend/schema';
import { AddLearnersDialogComponent } from './add-learners-dialog/add-learners.dialog';

@Component({
  selector: 'benji-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss'],
})
export class LearnersComponent implements OnInit {
  dialogRef;
  user: any;
  eventsSubject: Subject<void> = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.activatedRoute.data.forEach((data: any) => {
      this.user = data.dashData.user as TeamUser;
    });
  }

  ngOnInit() {
    // // create observable that emits click events
    // const source = fromEvent(window, 'scroll');
    // // map to string with given event timestamp
    // const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));
    // // output (example): 'Event time: 7276.390000000001'
    // const subscribe = example.subscribe(val => console.log(val));
  }

  removeParticipants() {
    this.eventsSubject.next();
  }
  addLearners() {
    this.dialogRef = this.dialog
      .open(AddLearnersDialogComponent, {
        data: {
          userId: this.user.id,
        },
        disableClose: true,
        panelClass: ['dashboard-dialog', 'add-learner-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log(res);
        }
      });
  }
}
