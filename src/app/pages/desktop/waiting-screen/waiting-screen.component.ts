import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import { ActivatedRoute, Router } from '@angular/router';

import { timer } from 'rxjs';
import {interval} from 'rxjs/internal/observable/interval';
import {startWith, switchMap, take, map, takeUntil, finalize} from 'rxjs/operators';

@Component({
  selector: 'app-desktop-waiting-screen',
  templateUrl: './waiting-screen.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class WaitingScreenComponent implements OnInit {
  sessionRunID: string;
  sessionRunDetails;
  whosHere;
  countDown;

  constructor(private backend: BackendService, route: ActivatedRoute, private router: Router) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.sessionRunDetails = {'sessionrun_code': 0, 'session': {'session_name': 'Loading...'}};
    this.whosHere = {'joined': [], 'missing': [], 'session_start_seconds': -1};
  }

  ngOnInit() {
    this.backend.get_sessionrun_details(this.sessionRunID).subscribe(
      resp => this.sessionRunDetails = resp,
      err => console.log(err)
    );

    interval(5000).pipe(
      startWith(0),
      switchMap(() => this.backend.get_sessionrun_attendance(this.sessionRunID))
    ).subscribe(
      resp => this.handleUpdate(resp),
      err => console.log(err)
    );
  }

  handleUpdate(resp) {
    if (this.countDown) {
      return;
    }
    this.whosHere = resp;
    if (this.whosHere.session_start_seconds >= 0) {
      this.countDown = timer(0, 1000).pipe(
        take(this.whosHere.session_start_seconds),
        map(() => --this.whosHere.session_start_seconds),
        finalize(() => this.router.navigate(['/desktop/session', {'sessionRunID': this.sessionRunID}]))
      ).subscribe();
    }
  }

  startFirstActivity() {
    this.backend.start_next_activity(this.sessionRunID).subscribe(
      resp => console.log('Activity Started'),
      err => console.log(err)
    );
  }
}
