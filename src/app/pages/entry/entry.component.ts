import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {
  selectedTab = 0;

  constructor() {}

  ngOnInit() {}

  showSignupTab(): void {
    this.selectedTab = 1;
  }
}
