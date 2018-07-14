import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as ons from 'onsenui';

import {BackendService} from '../../../services/backend.service';
import {Router} from '@angular/router';

import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-mobile-join',
  templateUrl: './mobile-join.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileJoinComponent implements OnInit {
  roomCode: string;

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  formSubmit() {
    this.backend.join_session(this.roomCode).subscribe(
      resp => this.router.navigate(['/mobile/session', {sessionRunID: resp['id']}]),
      err => ons.notification.alert('Could not find the room code entered. Please try again.')
    );
  }

}
