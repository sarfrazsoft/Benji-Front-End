import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-participant-hint-activity',
  templateUrl: './participant-hint-activity.component.html',
  styleUrls: ['./participant-hint-activity.component.scss']
})
export class ParticipantHintActivityComponent implements OnInit {

  constructor() { }

  public inputCharsRemaining: string;
  public hintWord = new FormControl('', Validators.required);

  ngOnInit() {
  }

}
