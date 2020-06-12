import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'benji-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  isEmailedReport = false;
  constructor(private router: Router, private layoutService: LayoutService) {
    // this.router.navigate(['/login']);
    layoutService.isEmailedReport$.subscribe((v) => {
      this.isEmailedReport = v;
    });
  }
}
