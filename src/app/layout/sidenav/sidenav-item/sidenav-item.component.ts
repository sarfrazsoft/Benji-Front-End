import { Component, Input } from '@angular/core';

export interface SidenavItem {
  navName: string;
  route?: string;
}

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html'
})
export class SidenavItemComponent {
  @Input() sidenavItem: SidenavItem;
}
