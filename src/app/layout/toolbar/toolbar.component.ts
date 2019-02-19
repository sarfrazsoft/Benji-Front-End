import { Component } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-topbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  firstName = 'Matt';
  lastName = 'Parson';
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.signOut();
  }
}
