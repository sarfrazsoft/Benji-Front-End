import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services';

export interface SidenavItem {
  navName: string;
  navRoute?: string;
}

@Component({
  selector: 'benji-sidenav-item',
  templateUrl: './sidenav-item.component.html',
})
export class SidenavItemComponent {
  @Input() sidenavItem: SidenavItem;
  constructor(private authService: AuthService) {}
  itemClicked(navName: string) {
    if (navName === 'Logout') {
      this.logout();
    }
  }

  logout() {
    this.authService.signOut();
  }
}
