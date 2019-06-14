import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'benji-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  constructor(private router: Router) {
    // this.router.navigate(['/login']);
  }
}
