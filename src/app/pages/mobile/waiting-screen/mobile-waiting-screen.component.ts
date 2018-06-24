import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs/internal/observable/interval';
import {startWith, switchMap} from 'rxjs/operators';

import {BackendService} from '../../../services/backend.service';

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

  constructor(private backend: BackendService, private router: Router, private route: ActivatedRoute) {
    this.sessionRunID = route.snapshot.params['sessionRunID'];
    this.identity = {'first_name': ''};
    this.whosHere = {'joined': [], 'missing': []};
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
      resp => this.whosHere = resp,
      err => console.log(err)
    );
  }

}
