import { Component, Input, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PastSessionsService } from 'src/app/dashboard/past-sessions/services/past-sessions.service';

@Component({
  selector: 'benji-assessment-bar',
  templateUrl: './assessment-bar.component.html',
  styleUrls: ['./assessment-bar.component.scss']
})
export class AssessmentBarComponent implements OnInit {
  @Input() questionSet: Array<any> = [];
  @Input() ratingLevels = [];

  scale = ['25', '50', '75', '100'];
  scores = [];
  colors = [
    'bg-primary-color-lighter',
    'bg-primary-color-light',
    'bg-primary-color',
    'bg-primary-color-dark',
    'bg-secondary-color-dark'
  ];
  legend = [];

  assessments = [];

  constructor(private pastSessionsService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionsService.getReports('73103').subscribe(res => {
      // this.questionSet = res.feedbackquestion_set;
      this.calculateRating();
      this.createLegend();
    });
  }

  calculateRating(): void {
    this.questionSet.forEach((q, i) => {
      this.scores.push([]);
      this.ratingLevels.forEach((r, j) => {
        this.scores[i][j] = { width: 0, score: 0, class: this.colors[j] };
      });
    });

    this.questionSet.forEach((question, questionIndex) => {
      const arr = [];
      this.ratingLevels.forEach(val => {
        arr.push(0);
      });
      question.feedbackuseranswer_set.forEach(ans => {
        const idx = this.ratingLevels.findIndex(
          val => ans.rating_answer === val.rating
        );
        arr[idx] = arr[idx] + 1;
      });
      const sum = arr.reduce((a, b) => a + b, 0);
      arr.forEach((n, i) => {
        let scoreOnScale = (n / sum) * 100;
        scoreOnScale = Math.round(scoreOnScale * 10) / 10;
        this.scores[questionIndex][i].score = scoreOnScale;
      });
    });
  }

  createLegend(): void {
    this.ratingLevels.forEach((r, j) => {
      this.legend.push({ text: r.name, color: this.colors[j] });
    });
  }
}
