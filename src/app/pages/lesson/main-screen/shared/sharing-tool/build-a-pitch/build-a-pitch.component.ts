import { Component, Input, OnChanges, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { BuildAPitchService } from 'src/app/services/activities';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';
import { UpdateDecoderV1 } from 'yjs/dist/src/internals';
export interface Entry {
  created: Date;
}
export interface TimeSpan {
  minutes: number;
  seconds: number;
}
@Component({
  selector: 'benji-build-a-pitch',
  templateUrl: './build-a-pitch.component.html',
  styleUrls: ['./build-a-pitch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildAPitchComponent implements OnInit, OnChanges {
  @Input() data: UpdateMessage;
  @Input() currentSpeaker: { displayName: string; id: number };
  pitchText = '';
  smilyCount = 0;
  flashCount = 0;

  constructor(private buildAPitchService: BuildAPitchService, private changeDetector: ChangeDetectorRef) {}

  entries: Entry[] = [];

  private destroyed$ = new Subject();

  ngOnInit(): void {
    this.getPitchText();
    this.reactionsCounts();
    this.addEntry();
    
    interval(1000).subscribe(() => {
      if (!this.changeDetector['destroyed']) {
        this.changeDetector.detectChanges();
      }
    });
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addEntry() {
    this.entries.push({
      created: new Date(),
    });
  }

  getElapsedTime(): TimeSpan {  
    let entry = this.entries[this.entries.length-1];
    let totalSeconds = Math.floor((new Date().getTime() - entry.created.getTime()) / 1000);
    
    let minutes = 0;
    let seconds = 0;

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    seconds = totalSeconds;
    
    return {
      minutes: minutes,
      seconds: seconds
    };
  }

  ngOnChanges() {
  }

  reactionsCounts() {
    this.smilyCount = 0;
    this.flashCount = 0;
    if (this.data.running_tools.share.feedback.participants) {
      this.data.running_tools.share.feedback.participants.forEach(participant => {
        if (participant.reaction === null) {
          return;
        } else if (participant.reaction === "could_be_better") {
          this.flashCount++;
        } else {
          this.smilyCount++;
        }
      });
    }
  }

  update() {
    this.getPitchText();
    this.reactionsCounts();
  }

  getPitchText() {
    this.pitchText = this.buildAPitchService.getPitchText(
      this.currentSpeaker.id,
      this.data.buildapitchactivity,
      true
    );
    //console.log(this.data.buildapitchactivity);
    this.addEntry();
  }

  getSharingUserName() {
    return this.currentSpeaker.displayName;
  }

}
