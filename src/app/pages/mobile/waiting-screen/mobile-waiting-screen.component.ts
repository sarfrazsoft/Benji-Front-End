import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs/internal/observable/interval';
import {finalize, map, startWith, switchMap, take} from 'rxjs/operators';

import {BackendService} from '../../../services/backend.service';
import {timer} from 'rxjs';

@Component({
  selector: 'app-mobile-join',
  templateUrl: './mobile-waiting-screen.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileWaitingScreenComponent implements OnInit {
  sessionRunID: string;
  identity;
  whosHere;
  countDown;

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.identity = {'first_name': ''};
    this.whosHere = {'joined': [], 'missing': [], 'start_session_seconds': -1};
  }

  ngOnInit() {
    this.backend.get_own_identity().subscribe(
      resp => this.identity = resp,
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
        finalize(() => this.router.navigate(['/mobile/session', {'sessionRunID': this.sessionRunID}]))
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
