import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-mcq-table',
  templateUrl: './mcq-table.component.html',
  styleUrls: ['./mcq-table.component.scss']
})
export class McqTableComponent implements OnInit, OnChanges {
  @Input() questionStatement = '';
  @Input() mcq: any = {};
  @Input() participants = [];

  @Input() columnHeaderMap = {};

  displayedColumns: string[] = [
    'prompt',
    'option1',
    'option2',
    'option3',
    'option4'
  ];
  bapTableData = [
    // {
    //   prompt: 'Matthew Parson',
    //   option1: '-',
    //   option2: '-',
    //   option3: '-',
    //   option4: '-'
    // },
    // {
    //   prompt: 'Abdullah M',
    //   option1: '-',
    //   option2: '-',
    //   option3: '-',
    //   option4: '-'
    // },
    // {
    //   prompt: 'Mahin Khan',
    //   option1: '-',
    //   option2: '-',
    //   option3: '-',
    //   option4: '-'
    // },
    // {
    //   prompt: 'Azim Wazeer',
    //   option1: '-',
    //   option2: '-',
    //   option3: '-',
    //   option4: '-'
    // }
  ];

  getColumnHeader(name: string) {
    return this.columnHeaderMap[name];
  }

  ngOnInit() {}

  ngOnChanges() {
    // console.log(this.mcq);
    // this.createColumnHeaderMap();
    // console.log(this.participants);
    this.createTableData();
  }

  createTableData() {
    // console.log(this.mcq);
    this.participants.forEach((p, i) => {
      this.bapTableData.push({ prompt: p.name });
      this.mcq.question.mcqchoice_set.forEach((choice, j) => {
        const answer = this.mcq.mcqactivityuseranswer_set.find(
          ans => ans.user.id === p.id
        );
        this.bapTableData[i]['option' + (j + 1)] =
          answer.answer === choice.id ? 'x' : '-';
        // did this pID ID select this choice id
      });
    });
  }

  createColumnHeaderMap() {
    this.mcq.question.mcqchoice_set.forEach((q, i) => {
      this.columnHeaderMap['opiton' + (i + 1)] = q.choice_text;
    });
    // console.log(this.columnHeaderMap);
  }
}
