import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinct, filter, flatMap, map, tap } from 'rxjs/operators';
import { TeamUser, User } from 'src/app/services/backend/schema';
import { AddLearnersDialogComponent } from './group-details/add-learners-dialog/add-learners.dialog';

@Component({
  selector: 'benji-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit {
  user: TeamUser;
  eventsSubject: Subject<void> = new Subject<void>();
  dialogRef;

  groups = [
    {
      name: 'Sales',
      members: 39,
      completedPercent: 100,
    },
    {
      name: 'Finance',
      members: 11,
      completedPercent: 69,
    },
    {
      name: 'Marketing',
      members: 20,
      completedPercent: 96,
    },
    {
      name: 'Operations',
      members: 33,
      completedPercent: 30,
    },
    {
      name: 'Human Resources',
      members: 5,
      completedPercent: 35,
    },
  ];

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

  addGroups() {
    this.router.navigate(['/dashboard/teams/add']);
  }

  addTeam() {
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

  removeGroups() {
    this.eventsSubject.next();
  }
  // emitEventToChild() {
  //   this.eventsSubject.next();
  // }
}
