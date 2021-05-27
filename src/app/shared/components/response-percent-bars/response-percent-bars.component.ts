import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import {
  ActivityReport,
  MCQActivityParticipantAnswerSet,
  MCQReport,
  PollReport,
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-response-percent-bars',
  templateUrl: './response-percent-bars.component.html',
  styleUrls: ['./response-percent-bars.component.scss'],
})
export class ResponsePercentBarsComponent implements OnInit, OnChanges {
  @Input() data: MCQReport | PollReport;
  @Input() questionIndex = 0;
  // Number of users who joined the lesson
  @Input() lessonJoinedUsersLength = 0;
  @Input() lessonJoinedUsers = [];
  // Number of users who answered this question
  @Input() questionRespondentsLength = 0;
  @Input() questionRespondents = [];
  @Input() choiceSet = [];
  @Input() userFilter = false;
  choices: Array<any> = [];

  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.updateBars();
    });
  }

  ngOnChanges() {
    this.updateBars();
  }

  updateBars() {
    if (this.data) {
      const questionRespondents = this.questionRespondents;
      let questionRespondents2 = questionRespondents;

      const choiceSet = this.choiceSet;

      // Iterate over each choice
      //    get the number of times this choice was selected
      //    get choice text
      //    get % of respondents for this choice from all respondents of the question
      let choiceRespondents: Array<MCQActivityParticipantAnswerSet>;
      this.choices = choiceSet.map((choice, i) => {
        choiceRespondents = questionRespondents.filter((answer) => answer.answer === choice.id);

        choiceRespondents = choiceRespondents.filter((respondent) => {
          return this.pastSessionService.filteredInUsers.find(
            (el) => respondent.participant.participant_code === el
          );
        });

        questionRespondents2 = questionRespondents2.filter((respondent) => {
          return this.pastSessionService.filteredInUsers.find(
            (el) => respondent.participant.participant_code === el
          );
        });

        const responsePercent = questionRespondents.length
          ? Math.round((choiceRespondents.length / questionRespondents.length) * 100)
          : 0;

        return {
          text: choice.choice_text,
          noOfResponses: choiceRespondents.length,
          is_correct: choice.is_correct,
          responsePercent: responsePercent,
        };
      });
    }
  }
}
