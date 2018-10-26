import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as ons from 'onsenui';

import {BackendService} from '../../../services/backend.service';
import {Router} from '@angular/router';

import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-participant-join',
  templateUrl: './participant-join.component.html',
  styleUrls: [
    './participant-join.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ParticipantJoinComponent implements OnInit {
  roomCode: string;

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  formSubmit() {
    this.backend.join_session(this.roomCode).subscribe(
      resp => this.router.navigate(['/participant/session', {sessionRunID: resp['id']}]),
      err => ons.notification.alert('Could not find the room code entered. Please try again.')
    );
  }

}
