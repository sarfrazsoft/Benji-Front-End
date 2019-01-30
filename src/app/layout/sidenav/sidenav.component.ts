import { Component, Input, OnInit } from '@angular/core';

import { SidenavItem } from './sidenav-item/sidenav-item.component';

export interface SidenavSection {
  section: number;
  items: SidenavItem;
}

@Component({
  selector: 'app-menu',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  sidenavSections: any[] = [];
  route: string;

  constructor() {}

  ngOnInit() {
    this.initNavigation();
  }

  initNavigation() {
    this.sidenavSections = [
      {
        section: 1,
        items: [
          {
            navName: 'Learners',
            navRoute: 'learners'
          },
          {
            navName: 'Groups',
            route: 'groups'
          },
          {
            navName: 'Past Sessions',
            route: 'pastsessions'
          }
        ]
      },
      {
        section: 2,
        items: [
          {
            navName: 'Account',
            route: 'accounts'
          },
          {
            navName: 'Settings',
            route: 'settings'
          },
          {
            navName: 'Help',
            route: 'help'
          }
        ]
      },
      {
        section: 3,
        items: [
          {
            navName: 'Logout',
            route: 'logout'
          }
        ]
      }
    ];
  }
}
