import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  firstName = 'Matt';
  lastName = 'Parson';
  constructor() {}

  logout(): void {
    // this.authService.logout();
  }
}
