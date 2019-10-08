import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-response-percent-bars',
  templateUrl: './response-percent-bars.component.html',
  styleUrls: ['./response-percent-bars.component.scss']
})
export class ResponsePercentBarsComponent implements OnInit, OnChanges {
  @Input() mcq: any;
  @Input() questionIndex = 0;
  // Number of users who joined the lesson
  @Input() lessonJoinedUsers = 0;
  // Number of users who answered this question
  @Input() questionRespondents = 0;
  choices: Array<any> = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.questionIndex);
    if (this.mcq) {
      const questionRespondents = this.mcq.mcqactivityuseranswer_set.length;

      // Iterate over each choice
      //    get the number of times this choice was selected
      //    get choice text
      //    get % of respondents for this choice from all respondents of the question
      this.choices = this.mcq.question.mcqchoice_set.map((choice, i) => {
        const choiceRespondents = this.mcq.mcqactivityuseranswer_set.filter(
          answer => answer.answer === choice.id
        ).length;

        console.log(choice);

        return {
          text: choice.choice_text,
          noOfResponses: choiceRespondents,
          is_correct: choice.is_correct,
          responsePercent: Math.round(
            (choiceRespondents / questionRespondents) * 100
          )
        };
      });

      console.log(this.choices);
    }
  }
}
