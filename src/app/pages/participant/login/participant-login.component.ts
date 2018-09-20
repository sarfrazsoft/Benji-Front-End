import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';

import {BackendService} from '../../../services/backend.service';
import {Router} from '@angular/router';

import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-participant-login',
  templateUrl: './participant-login.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class ParticipantLoginComponent implements OnInit {
  username: string;

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.logout();
    }
  }

  formSubmit() {
    this.auth.login(this.username, 'test').subscribe(
      resp => this.router.navigate(['/participant/join']),
      err => this.backend.create_user(this.username).subscribe(
        resp2 => this.auth.login(this.username, 'test').subscribe(
          resp3 => this.router.navigate(['/participant/join']),
          err3 => console.log(err3)
        ),
        err2 => console.log(err2)
      )
    );
  }

}
