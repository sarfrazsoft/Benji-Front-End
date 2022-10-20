import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services';
import { UserInvitation } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-copy-template',
  templateUrl: './copy-template.component.html',
})
export class CopyTemplateComponent implements OnInit {
  // invitation: UserInvitation;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const templateId = Number(this.activatedRoute.snapshot.params['templateId']);
    if (this.authService.isLoggedIn()) {
      console.log(templateId);
      // setTimeout(() => {
      //   this.router.navigate(['/dashboard']);
      // }, 3000);
    } else {
      this.router.navigate(['/login?templateId=' + templateId]);
    }
    // console.log(params['inviteId']);
    // console.log(params['inviteToken']);
    // const templateId = Number(params['templateId']);

    // this.authService
    //   .getInivitationDetails(params['inviteId'], params['inviteToken'])
    //   .subscribe((res: UserInvitation) => {
    //     // console.log(res);
    //     this.authService.userInvitation = res;
    //     this.router.navigate(['/login']);
    //   });
    // });
    //     curl --location --request POST '<hostname>/api/course_details/use-template/' \
    // --header 'Authorization: Bearer <token>' \
    // --header 'Content-Type: application/json' \
    // --data-raw '{
    //     "lesson_run_code": 85274
    // }'
  }
}
