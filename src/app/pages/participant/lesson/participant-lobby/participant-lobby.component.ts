import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-participant-lobby',
  templateUrl: './participant-lobby.component.html',
  styleUrls: ['./participant-lobby.component.scss']
})
export class ParticipantLobbyComponent implements OnInit {

  @Input()
  set socketData(data) {
    this.title = data.message.lesson.lesson_name;
  }

  public title;

  constructor() { }

  ngOnInit() {
  }

}
