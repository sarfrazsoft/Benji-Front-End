import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {BackendService} from '../../services/backend.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class LandingComponent implements OnInit {
  constructor(private backend: BackendService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  loginAndStart() {
    this.auth.login('admin', 'benji112').subscribe(
      response => this.backend.get_runnable_sessions(1).subscribe(
                  resp => this.checkAndStart(resp),
                  err => console.log(err)
      ),
      err => console.log(err)
    );
  }

  checkAndStart(runnable_sessions) {
    if (runnable_sessions.length < 1) {
      console.log('Error: No runnable sessions found');
    } else {
      this.backend.start_session(1, runnable_sessions[0].session_num).subscribe(
        resp => this.router.navigate(['/desktop/waiting-screen', {sessionRunID: resp['id']}]),
        err => console.log(err)
      );
    }
  }
}
