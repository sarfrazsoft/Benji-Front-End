import { Component, Input, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import { FeedbackGraphQuestion } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.scss'],
})
export class TextQuestionComponent implements OnInit {
  @Input() question: FeedbackGraphQuestion;
  @Input() userFilter = false;
  comboAnswers: Array<string> = [];
  comboAnswersExist = false;
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.updateAnswers();
    });
  }

  updateAnswers() {
    this.comboAnswers = [];
    this.comboAnswersExist = false;

    this.question.assessments.forEach((answer) => {
      if (
        this.pastSessionService.filteredInUsers.find((el) => el === answer.participant_code) ||
        !this.userFilter
      ) {
        if (answer.text) {
          this.comboAnswersExist = true;
        }
        this.comboAnswers.push(answer.text);
      }
    });
  }
}
