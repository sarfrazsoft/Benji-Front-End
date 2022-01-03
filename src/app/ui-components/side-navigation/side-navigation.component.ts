import {Component, Input, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'side-navigation',
  templateUrl: 'side-navigation.component.html',
})
export class SideNavigationComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @Input()
  sideNavOpen: boolean;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
}
