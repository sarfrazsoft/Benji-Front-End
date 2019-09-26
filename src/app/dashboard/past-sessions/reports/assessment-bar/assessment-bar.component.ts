import { Component, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/dashboard/past-sessions/services/past-sessions.service';

@Component({
  selector: 'benji-assessment-bar',
  templateUrl: './assessment-bar.component.html',
  styleUrls: ['./assessment-bar.component.scss']
})
export class AssessmentBarComponent implements OnInit {
  scale = ['25', '50', '75', '100'];
  scores = [
    { width: 100, score: 50, class: 'bg-primary-color-dark' },
    { width: 50, score: 20, class: 'bg-primary-color' },
    { width: 30, score: 30, class: 'bg-primary-color-light' },
    { width: 10, score: 10, class: 'bg-primary-color-lighter' }
  ];
  assessments = [];
  // 20, 30, 10
  constructor(private pastSessionsService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionsService.getReports('73103').subscribe(res => {
      console.log(res);
      res.assessments.forEach(fback => {
        let avg = 0;
        const noOfQuestions = fback.feedbackquestion_set.length;
        fback.feedbackquestion_set.forEach(question => {
          avg = avg + parseFloat(question.average_rating);
        });
        avg = avg / noOfQuestions;
        this.assessments.push(Math.round(avg * 100) / 100);
      });
      console.log(this.assessments);
    });
  }
}
