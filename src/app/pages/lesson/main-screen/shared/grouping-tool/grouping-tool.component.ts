import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-ms-grouping-tool',
  templateUrl: './grouping-tool.component.html',
})
export class MainScreenGroupingToolComponent implements OnInit {
  groupingTitle: '';
  allUsers = [];
  breakoutRooms = [];
  private typingTimer;
  constructor() {}

  ngOnInit(): void {}

  typingStoped(event) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.doneTyping();
    }, 1500);
  }

  // on keydown, clear the countdown
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  doneTyping() {
    // console.log(this.groupingTitle);
  }
  drop($event) {}
  addGroup() {}
}
