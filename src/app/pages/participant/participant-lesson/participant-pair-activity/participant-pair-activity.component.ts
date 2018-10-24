import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participant-pair-activity',
  templateUrl: './participant-pair-activity.component.html',
  styleUrls: ['./participant-pair-activity.component.scss']
})
export class ParticipantPairActivityComponent implements OnInit {

  constructor() { }

  public isReady = false;
  public pairActivityStarted = true;

  ngOnInit() {
  }


  public sendReadyState() {
    this.isReady = true;
  }
}
