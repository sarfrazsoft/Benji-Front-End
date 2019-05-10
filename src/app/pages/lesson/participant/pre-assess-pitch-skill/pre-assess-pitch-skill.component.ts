import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-pre-assess-pitch-skill',
  templateUrl: './pre-assess-pitch-skill.component.html',
  styleUrls: ['./pre-assess-pitch-skill.component.scss']
})
export class ParticipantPreAssessPitchSkillComponent
  extends BaseActivityComponent
  implements OnInit {
  answersSubmitted: boolean;

  constructor() {
    super();
  }

  ngOnInit() {}

  submitAnswers(event) {
    this.sendMessage.emit(event);
    this.answersSubmitted = true;
  }
}
