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
      response => this.backend.create_courserun(1).subscribe(
                  resp => this.checkAndStart(resp),
                  err => console.log(err)
      ),
      err => console.log(err)
    );
  }

  checkAndStart(courserun) {
    this.backend.start_next_session(courserun.id).subscribe(
      resp => this.router.navigate(['/desktop/session', {sessionRunID: resp['id']}]),
      err => console.log(err)
    );
  }
}
