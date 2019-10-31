import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';

@Component({
  selector: 'benji-pitch-o-matic',
  templateUrl: './pitch-o-matic.component.html',
  styleUrls: ['./pitch-o-matic.component.scss']
})
export class PitchOMaticComponent implements OnInit, OnChanges {
  @Input() data;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor() {}

  displayedColumns: string[] = ['question', 'average'];
  tableData = [];

  getTotalAverage() {
    return 4;
  }

  ngOnInit() {
    if (this.data && this.data.pom) {
      const pomData = this.data.pom;

      pomData.feedbackquestion_set.forEach(question => {
        let sum = 0;
        pomData.pitchomaticgroupmembers.forEach(member => {
          const rating = member.pitchomaticfeedback_set.find(
            fb => fb.feedbackquestion === question.id
          );
          if (rating) {
            sum = sum + rating.rating_answer;
          }
        });
        const avg = sum / this.data.joined_users.length;
        this.tableData.push({
          question: question.question_text,
          questionId: question.id,
          average: avg
        });
      });
    }
  }

  ngOnChanges() {}
}
