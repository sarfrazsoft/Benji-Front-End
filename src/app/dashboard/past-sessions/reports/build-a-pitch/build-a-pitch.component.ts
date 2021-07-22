import { Component, OnInit } from '@angular/core';
import { BuildAPitchService, PastSessionsService } from 'src/app/services';
import { ActivityReport, BuildAPitchActivity } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-build-a-pitch-report',
  templateUrl: './build-a-pitch.component.html',
  styleUrls: ['./build-a-pitch.component.scss'],
})
export class BuildAPitchComponent implements OnInit {
  data: ActivityReport;
  pitchSummaries = [];
  pitchSummariesRaw = [];
  constructor(
    private pastSessionService: PastSessionsService,
    private buildAPitchService: BuildAPitchService
  ) {}

  displayedColumns: string[] = [];
  bapTableData = [];
  ngOnInit() {
    this.updateBAPData();
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.updateBAPData();
    });
  }

  updateBAPData() {
    if (this.data) {
      this.pitchSummariesRaw = this.data.bap.pitch_summaries;

      this.pitchSummaries = this.pitchSummariesRaw.filter((pitchSummary) => {
        return this.pastSessionService.filteredInUsers.find(
          (el) => el === pitchSummary.participant.participant_code
        );
      });
    }
  }

  // getPitchText(pitch) {
  //   console.log(pitch);
  // }

  getPitchText(participantCode: number, act: BuildAPitchActivity, sharingTool = false) {
    let parsedBlanks = this.buildAPitchService.getBlanks(act.blanks_string);
    parsedBlanks = parsedBlanks.filter((e) => e.type === 'label');
    const blanks = act.buildapitchblank_set;
    const buildAPitchPitchSet = act.buildapitchpitch_set.filter(
      (e) => e.participant.participant_code === participantCode
    );

    let statement = '';
    if (buildAPitchPitchSet[0]) {
      const buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
      parsedBlanks.forEach((b, i) => {
        const currentBlanksValue = buildAPitchEntrySet[i];

        let value = '';
        if (currentBlanksValue) {
          if (sharingTool) {
            value = ' <em class="primary-color">' + currentBlanksValue.value + '</em> ';
          } else {
            value = ' <em>' + currentBlanksValue.value + '</em> ';
          }
        } else {
          value = ' <em class="warning-color">(' + b.temp_text ? b.temp_text : '' + ')</em> ';
        }
        statement = statement + b.label + value;
      });
    }
    return statement;
  }
}
