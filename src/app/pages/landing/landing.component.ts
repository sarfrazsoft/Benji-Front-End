import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {BackendService} from '../../services/backend.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [
    './landing.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class LandingComponent implements OnInit {
  constructor(private backend: BackendService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  loginAndStart(courseNum?) {
    // this.auth.login('admin', 'benji112').subscribe(
    //   response => this.backend.create_courserun(courseNum).subscribe(
    //               resp => this.checkAndStart(resp),
    //               err => console.log(err)
    //   ),
    //   err => console.log(err)
    // );
    console.log('go')
    this.router.navigate(['/screen/lesson/1']);
  }

  checkAndStart(courserun) {
    this.backend.start_next_session(courserun.id).subscribe(
      resp => this.router.navigate(['/desktop/session', {sessionRunID: resp['id']}]),
      err => console.log(err)
    );
  }
}
