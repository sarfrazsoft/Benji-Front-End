import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';

import {interval} from 'rxjs/internal/observable/interval';
import {startWith, switchMap} from 'rxjs/operators';

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

  constructor(private backend: BackendService, route: ActivatedRoute) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.sessionRunDetails = {'sessionrun_code': 0, 'session': {'session_name': 'Loading...'}};
    this.whosHere = {'joined': [], 'missing': []};
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
      resp => this.whosHere = resp,
      err => console.log(err)
    );
  }
}
