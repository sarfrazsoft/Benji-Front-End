import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'benji-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  userRole = 'admim';
  constructor(private auth: AuthService) {
    this.userRole = auth.getUserRole() as string;
  }
}
