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
  @Input() data: UpdateMessage;
  @Input() currentSpeaker: { displayName: string; id: number };
  pitchText = '';
  constructor(private buildAPitchService: BuildAPitchService) {}

  ngOnInit(): void {
    this.getPitchText();
  }

  ngOnChanges() {}

  update() {
    this.getPitchText();
  }

  getPitchText() {
    this.pitchText = this.buildAPitchService.getPitchText(
      this.currentSpeaker.id,
      this.data.buildapitchactivity,
      true
    );

    console.log(this.data.buildapitchactivity);
  }

  getSharingUserName() {
    return this.currentSpeaker.displayName;
  }
}
