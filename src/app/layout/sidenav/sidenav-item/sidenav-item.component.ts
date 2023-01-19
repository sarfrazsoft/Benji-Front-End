import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services';

export interface SidenavItem {
  navName: string;
  navRoute?: string;
  disabled?: boolean;
  icon?: string;
  hoverIcon?: string;
}

@Component({
  selector: 'benji-sidenav-item',
  templateUrl: './sidenav-item.component.html',
})
export class SidenavItemComponent implements OnInit {
  @Input() sidenavItem: SidenavItem;
  @Output() loadHomeEvent = new EventEmitter();

  activeIcon: string;
  imgSrc: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (this.sidenavItem.icon) {
      this.imgSrc = this.sidenavItem.icon;
    }
  }

  itemClicked(navName: string) {
    if (navName === 'Logout') {
      this.logout();
    } else if (navName === 'Help Center') {
      window.open('https://guides.mybenji.com/', '_blank');
    } else if (navName === 'Templates') {
      window.open('https://www.mybenji.com/templates', '_blank');
    } else if (navName === 'Home') {
      this.loadHomeEvent.emit();
    }
  }

  logout() {
    this.authService.signOut();
  }
}
