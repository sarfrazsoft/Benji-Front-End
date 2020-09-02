import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-mcqs',
  templateUrl: './mcqs.component.html',
  styleUrls: ['./mcqs.component.scss'],
})
export class McqsComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  participants = [];
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    // console.log(this.data);
    if (this.data.participant_set) {
      this.participants = this.data.participant_set.map((a) => {
        return { name: a.display_name, id: a.participant_code };
      });
    }
  }

  getColumnHeaders(mcq) {
    const columnHeaderMap = {};
    mcq.question.mcqchoice_set.forEach((q, i) => {
      columnHeaderMap['option' + (i + 1)] = q.choice_text;
    });
    return columnHeaderMap;
  }
}
