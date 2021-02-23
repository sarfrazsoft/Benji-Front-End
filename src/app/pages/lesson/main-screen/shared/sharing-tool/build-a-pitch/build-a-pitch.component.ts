import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BuildAPitchService } from 'src/app/services/activities';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-build-a-pitch',
  templateUrl: './build-a-pitch.component.html',
  styleUrls: ['./build-a-pitch.component.scss'],
})
export class BuildAPitchComponent implements OnInit, OnChanges {
  // @Input() data: { state: UpdateMessage; participant: Participant };
  @Input() data: UpdateMessage;
  @Input() currentSpeaker: Participant;
  pitchText = '';
  constructor(private buildAPitchService: BuildAPitchService) {}

  ngOnInit(): void {
    // console.log(
    //   this.buildAPitchService.getPitchText(
    //     this.data.participant.participant_code,
    //     this.data.state.buildapitchactivity
    //   )
    // );
    // this.pitchText = this.buildAPitchService.getPitchText(
    //   this.currentSpeaker.participant_code,
    //   this.data.buildapitchactivity
    // );
  }

  ngOnChanges() {
    console.log('jurr');
    // this.pitchText = this.buildAPitchService.getPitchText(
    //   this.currentSpeaker.participant_code,
    //   this.data.buildapitchactivity
    // );
  }

  update() {
    this.pitchText = this.buildAPitchService.getPitchText(
      this.currentSpeaker.participant_code,
      this.data.buildapitchactivity
    );
  }
}
