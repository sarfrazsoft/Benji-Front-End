import { Component, Input, OnInit } from '@angular/core';
import { FeedbackGraphQuestion } from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';

@Component({
  selector: 'benji-text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.scss']
})
export class TextQuestionComponent implements OnInit {
  @Input() question: FeedbackGraphQuestion;
  @Input() userFilter = false;
  comboAnswers: Array<string> = [];
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(updatedUserFilter => {
      this.updateAnswers();
    });

    // this.updateAnswers();
  }

  updateAnswers() {
    this.comboAnswers = [];

    this.question.assessments.forEach(answer => {
      if (
        this.pastSessionService.filteredInUsers.find(
          el => el === answer.user.id
        ) ||
        !this.userFilter
      ) {
        this.comboAnswers.push(answer.text);
      }
    });
  }
}
