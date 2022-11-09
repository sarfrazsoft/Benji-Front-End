import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services';
import { UserInvitation, UseTemplateResponse } from 'src/app/services/backend/schema';

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
      this.authService.useTemplate(templateId).subscribe((res: UseTemplateResponse) => {
        if (res.detail.includes('Template is created successfully')) {
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      this.router.navigate(['/login'], {
        relativeTo: this.activatedRoute,
        queryParams: { templateId: templateId },
        queryParamsHandling: 'merge',
      });
    }
  }
}
