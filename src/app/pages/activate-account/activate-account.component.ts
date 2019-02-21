import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  verifying = true;
  verified = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.authService
        .checkConfirmationCode(params['confirmationCode'])
        .subscribe(
          res => {
            this.verifying = false;
            // Tell people the account was activated and they can login on this link
            if (res.detail === 'ok') {
              this.verified = true;
            } else {
              this.verified = false;
            }
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  ngOnInit() {}
}
