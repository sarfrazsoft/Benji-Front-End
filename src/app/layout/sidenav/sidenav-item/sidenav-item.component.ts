import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services';

export interface SidenavItem {
  navName: string;
  navRoute?: string;
  disabled?: boolean;
  icon?: string;
  hoverIcon?: string;
  activeIcon?: string;
}

@Component({
  selector: 'benji-sidenav-item',
  templateUrl: './sidenav-item.component.html',
})
export class SidenavItemComponent implements OnInit {
  @Input() sidenavItem: SidenavItem;
  @Output() navItemClickedEvent = new EventEmitter();

  icon: string;
  activeIcon: string;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (this.sidenavItem.icon) {
      this.icon = this.sidenavItem.icon;
    }
    if (this.sidenavItem.activeIcon) {
      this.activeIcon = this.sidenavItem.activeIcon;
    }
  }

  itemClicked(navName: string) {
    if (navName === 'Logout') {
      this.logout();
    } else if (navName === 'Help Center') {
      window.open('https://guides.mybenji.com/', '_blank');
    }
    this.navItemClickedEvent.emit();
  }

  logout() {
    this.authService.signOut();
  }

}
