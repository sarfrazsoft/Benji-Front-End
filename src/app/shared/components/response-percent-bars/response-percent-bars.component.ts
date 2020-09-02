import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport, MCQActivityParticipantAnswerSet, MCQReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-response-percent-bars',
  templateUrl: './response-percent-bars.component.html',
  styleUrls: ['./response-percent-bars.component.scss'],
})
export class ResponsePercentBarsComponent implements OnInit, OnChanges {
  @Input() mcq: MCQReport;
  @Input() questionIndex = 0;
  // Number of users who joined the lesson
  @Input() lessonJoinedUsers = 0;
  // Number of users who answered this question
  @Input() questionRespondents = 0;
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
    if (this.mcq) {
      let questionRespondents = this.mcq.mcqactivityparticipantanswer_set;

      // Iterate over each choice
      //    get the number of times this choice was selected
      //    get choice text
      //    get % of respondents for this choice from all respondents of the question
      let choiceRespondents: Array<MCQActivityParticipantAnswerSet>;
      this.choices = this.mcq.question.mcqchoice_set.map((choice, i) => {
        choiceRespondents = this.mcq.mcqactivityparticipantanswer_set.filter(
          (answer) => answer.answer === choice.id
        );

        choiceRespondents = choiceRespondents.filter((respondent) => {
          return this.pastSessionService.filteredInUsers.find(
            (el) => respondent.participant.participant_code === el
          );
        });

        questionRespondents = questionRespondents.filter((respondent) => {
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
