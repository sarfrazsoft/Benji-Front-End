import { Component, Input } from '@angular/core';

export interface SidenavItem {
  navName: string;
  navRoute?: string;
}

@Component({
  selector: 'benji-sidenav-item',
  templateUrl: './sidenav-item.component.html'
})
export class SidenavItemComponent {
  @Input() sidenavItem: SidenavItem;
}
