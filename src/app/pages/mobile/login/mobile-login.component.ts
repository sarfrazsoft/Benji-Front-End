import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';

import {BackendService} from '../../../services/backend.service';
import {Router} from '@angular/router';

import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-mobile-login',
  templateUrl: './mobile-login.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileLoginComponent implements OnInit {
  username: string;

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  formSubmit() {
    this.auth.login(this.username, 'test').subscribe(
      resp => this.router.navigate(['/mobile/join']),
      err => this.backend.create_user(this.username).subscribe(
        resp2 => this.auth.login(this.username, 'test').subscribe(
          resp3 => this.router.navigate(['/mobile/join']),
          err3 => console.log(err3)
        ),
        err2 => console.log(err2)
      )
    );
  }

}
