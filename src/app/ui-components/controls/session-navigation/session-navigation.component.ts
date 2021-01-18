import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-session-navigation',
  templateUrl: './session-navigation.component.html',
  styleUrls: [],
})
export class SessionNavigationComponent implements OnInit {
  votingSetup = false;
  votingStarted = true;
  constructor() {}

  ngOnInit(): void {}
}
