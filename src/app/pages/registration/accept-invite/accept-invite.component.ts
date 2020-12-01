import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services';
import { UserInvitation } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.scss']
})
export class AcceptInviteComponent implements OnInit {
  // invitation: UserInvitation;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      // console.log(params['inviteId']);
      // console.log(params['inviteToken']);
      this.authService.invitationToken = Number(params['inviteToken']);
      this.authService
        .getInivitationDetails(params['inviteId'], params['inviteToken'])
        .subscribe((res: UserInvitation) => {
          // console.log(res);
          this.authService.userInvitation = res;
          this.router.navigate(['/login']);
        });
    });
  }
}
