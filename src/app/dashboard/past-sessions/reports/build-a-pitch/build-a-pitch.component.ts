import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-build-a-pitch-report',
  templateUrl: './build-a-pitch.component.html',
  styleUrls: ['./build-a-pitch.component.scss']
})
export class BuildAPitchComponent implements OnInit {
  constructor() {}
  data: any;

  displayedColumns: string[] = [
    // 'prompt',
    // 'person1',
    // 'person2',
    // 'person3',
    // 'person4',
    // 'person5'
  ];
  bapTableData = [
    // {
    //   prompt: 'My organization',
    //   person1: 'Benji',
    //   person2: 'Benji 2',
    //   person3: 'Benx',
    //   person4: 'PAN AM',
    //   person5: 'PB'
    // },
    // {
    //   prompt: 'Helps (audience)',
    //   person1: 'Companies',
    //   person2: 'Trainers',
    //   person3: 'Learners',
    //   person4: 'Car drivers',
    //   person5: 'Oil drillers'
    // },
    // {
    //   prompt: 'With (problem)',
    //   person1: 'Scaling their workshops',
    //   person2: 'scale their company',
    //   person3: 'master soft skills',
    //   person4: 'flying problems',
    //   person5: 'getting the oil out'
    // },
    // {
    //   prompt: 'Because (the why)',
    //   person1: 'Face to face learning is a sham',
    //   person2: 'limited resources',
    //   person3: 'future bros',
    //   person4: 'are you my dead head',
    //   person5: 'its money'
    // }
  ];
  ngOnInit() {
    console.log(this.data);

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
      console.log(bapTableData);
      console.log(displayedColumns);
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
