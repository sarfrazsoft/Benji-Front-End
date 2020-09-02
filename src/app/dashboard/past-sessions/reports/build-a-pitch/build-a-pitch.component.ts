import { Component, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-build-a-pitch-report',
  templateUrl: './build-a-pitch.component.html',
  styleUrls: ['./build-a-pitch.component.scss'],
})
export class BuildAPitchComponent implements OnInit {
  data: ActivityReport;
  constructor(private pastSessionService: PastSessionsService) {}

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
      const displayedColumns = ['prompt'];
      this.data.participant_set.forEach((user: Participant) => {
        if (this.pastSessionService.filteredInUsers.find((el) => el === user.participant_code)) {
          displayedColumns.push(user.participant_code + '');
        }
      });
      const bapTableData = [];
      const blanks = this.data.bap.buildapitchblank_set;
      blanks.sort((a, b) => a.order - b.order);

      blanks.forEach((set) => {
        const pSummary = this.data.bap.pitch_summaries;
        const obj = {};
        pSummary.forEach((userData) => {
          if (
            this.pastSessionService.filteredInUsers.find((el) => el === userData.participant.participant_code)
          ) {
            const blankValue = userData.buildapitchentry_set.find((o) => o.buildapitchblank === set.id);
            const user = userData.participant.participant_code;

            obj[user] = blankValue ? blankValue.value : '-';
          }
        });
        bapTableData.push({
          prompt: set.label + ' (' + set.temp_text + ') ',
          ...obj,
        });
      });
      this.bapTableData = bapTableData;
      this.displayedColumns = displayedColumns;
    }
  }

  getPersonName(id: string) {
    const user = this.data.participant_set.find((u: Participant) => u.participant_code + '' === id);
    return user.display_name;
  }

  getTotalVotes(id: string) {
    const pSummary = this.data.bap.pitch_summaries.find((u) => u.participant.participant_code + '' === id);
    return pSummary ? pSummary.votes : '-';
  }
}
