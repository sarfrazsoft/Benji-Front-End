import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivityTypes as Acts } from 'src/app/globals';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-mcqs',
  templateUrl: './mcqs.component.html',
})
export class McqsComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  title = '';
  participants = [];
  at = Acts;
  constructor() {}

  ngOnInit() {
    console.log(this.data);
    if (this.data.activity_type === Acts.poll) {
      this.title = 'Poll';
    } else {
      this.title = 'Multiple Choice Question';
    }
  }

  ngOnChanges() {}

  getColumnHeaders(mcq) {
    // const columnHeaderMap = {};
    // mcq.question.mcqchoice_set.forEach((q, i) => {
    //   columnHeaderMap['option' + (i + 1)] = q.choice_text;
    // });
    // return columnHeaderMap;
    return 'default';
  }
}
