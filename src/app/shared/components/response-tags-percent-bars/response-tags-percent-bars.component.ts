import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivityReport, MCQReport } from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';

@Component({
  selector: 'benji-response-tags-percent-bars',
  templateUrl: './response-tags-percent-bars.component.html',
  styleUrls: ['./response-tags-percent-bars.component.scss']
})
export class ResponseTagsPercentBarsComponent implements OnInit, OnChanges {
  @Input() tagsQuestion: any;
  @Input() questionIndex = 0;
  // Number of users who joined the lesson
  @Input() lessonJoinedUsers = 0;
  // Number of users who answered this question
  @Input() questionRespondents = 0;
  @Input() userFilter = false;
  choices: Array<any> = [];

  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(updatedUserFilter => {
      this.updateBars();
    });
  }

  ngOnChanges() {
    this.updateBars();
  }

  updateBars() {
    if (this.tagsQuestion) {
      // let questionRespondents = this.mcq.mcqactivityuseranswer_set;
      let totalResponses = 0;
      this.tagsQuestion.tagScores.forEach(tag => {
        totalResponses = tag.score;
      });
      // Iterate over each choice
      //    get the number of times this choice was selected
      //    get choice text
      //    get % of respondents for this choice from all respondents of the question
      // let choiceRespondents;
      const tagScores = this.tagsQuestion.tagScores;
      this.choices = tagScores.map((choice, i) => {
        // choiceRespondents = this.mcq.mcqactivityuseranswer_set.filter(
        //   answer => answer.answer === choice.id
        // );
        // questionRespondents = questionRespondents.filter(respondent => {
        //   return this.pastSessionService.filteredInUsers.find(
        //     el => respondent.user.id === el
        //   );
        // });
        const percent = (100 * choice.score) / tagScores[0].score;

        return {
          text: choice.name,
          noOfResponses: choice.score,
          percent: percent
        };
      });
    }
  }
}
