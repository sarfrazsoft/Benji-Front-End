import { Component, OnInit } from '@angular/core';
import { AuthService, ContextService } from 'src/app/services';

@Component({
  selector: 'benji-topbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  user: any = {};
  constructor(
    private authService: AuthService,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.contextService.selected$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  logout(): void {
    this.authService.signOut();
  }
}
