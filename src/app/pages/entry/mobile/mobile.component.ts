import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'benji-mobile-entry',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  isDemoSite = true;
  constructor(private router: Router) {
    // demo.mybenji.com
    if (window.location.href.split('.')[0].includes('demo')) {
      this.isDemoSite = true;
    }
  }
  showLoginMob = true;

  ngOnInit() {}
}
