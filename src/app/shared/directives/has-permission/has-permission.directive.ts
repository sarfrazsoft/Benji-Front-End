import { Directive, HostBinding, HostListener, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';
import { TeamUser, User } from 'src/app/services/backend/schema';

@Directive({
  selector: '[benji-has-permission]',
})
export class HasPermissionDirective implements OnInit {
  @HostBinding('style.display')
  display: string;

  constructor(private contextService: ContextService) {}

  ngOnInit() {
    this.contextService.user$.subscribe((user: TeamUser) => {
      if (!user) {
        this.display = 'none';
      }
    });
  }
}
