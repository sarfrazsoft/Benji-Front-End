import { Component, OnInit, ViewEncapsulation, NgModule } from '@angular/core';

import {BackendService} from '../../../services/backend.service';
import {Router} from '@angular/router';

import {AuthService} from '../../../services/auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-participant-login',
  templateUrl: './participant-login.component.html',
  styleUrls: [
    './participant-login.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class ParticipantLoginComponent implements OnInit {
  // username: string;

  public isUserValid: boolean;
  public userId;


  public username = new FormControl(null, [
    Validators.required
  ]);

  constructor(private backend: BackendService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    // if (this.auth.isLoggedIn()) {
    //   this.auth.logout();
    // }
  }

  formSubmit() {
    this.router.navigate([`/participant/join`]);
    // this.auth.login(this.username, 'test').subscribe(
    //   resp => this.router.navigate(['/participant/join']),
    //   err => this.backend.create_user(this.username).subscribe(
    //     resp2 => this.auth.login(this.username, 'test').subscribe(
    //       resp3 => this.router.navigate(['/participant/join']),
    //       err3 => console.log(err3)
    //     ),
    //     err2 => console.log(err2)
    //   )
    // );
  }

  public createUser() {
    this.backend.create_user(this.username.value).subscribe((res: any) => {
      if (res.is_active) {
        console.log('activated user');
        this.auth.login(res.username, 'test').subscribe(() => {
          this.isUserValid = true;
        });
      }
    });
  }

}
