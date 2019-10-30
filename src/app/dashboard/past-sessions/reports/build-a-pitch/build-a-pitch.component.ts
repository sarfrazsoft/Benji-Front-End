import { Component, OnInit } from '@angular/core';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-build-a-pitch-report',
  templateUrl: './build-a-pitch.component.html',
  styleUrls: ['./build-a-pitch.component.scss']
})
export class BuildAPitchComponent implements OnInit {
  data: ActivityReport;
  constructor() {}

  displayedColumns: string[] = [];
  bapTableData = [];
  ngOnInit() {
    if (this.data) {
      const displayedColumns = ['prompt'];
      this.data.joined_users.forEach(user => {
        displayedColumns.push(user.id + '');
      });
      const bapTableData = [];
      const blanks = this.data.bap.buildapitchblank_set;
      blanks.sort((a, b) => a.order - b.order);

      blanks.forEach(set => {
        const pSummary = this.data.bap.pitch_summaries;
        const obj = {};
        pSummary.forEach(userData => {
          const blankValue = userData.buildapitchentry_set.find(
            o => o.buildapitchblank === set.id
          );
          const user = userData.user;

          obj[user] = blankValue.value ? blankValue.value : '';
        });
        bapTableData.push({
          prompt: set.label + ' (' + set.temp_text + ') ',
          ...obj
        });
      });
      this.bapTableData = bapTableData;
      this.displayedColumns = displayedColumns;
    }
  }

  getPersonName(id: string) {
    const user = this.data.joined_users.find(u => u.id + '' === id);
    return user.first_name + ' ' + user.last_name;
  }

  getTotalVotes(id: string) {
    const pSummary = this.data.bap.pitch_summaries.find(
      u => u.user + '' === id
    );
    return pSummary.votes;
  }
}
