import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-vote-control',
  templateUrl: './vote-control.component.html',
  styleUrls: [],
})
export class VoteControlComponent implements OnInit {
  votingSetup = true;
  votingStarted = false;
  constructor() {}

  ngOnInit(): void {}
}
