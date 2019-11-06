import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-learner-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.scss']
})
export class McqComponent implements OnInit, OnChanges {
  @Input() mcq: any = mcq;
  @Input() questionIndex = 0;
  // Number of users who joined the lesson
  @Input() lessonJoinedUsers = 0;
  // Number of users who answered this question
  @Input() questionRespondents = 0;
  choices: Array<any> = [];

  userId = 2;

  constructor() {}

  ngOnInit() {
    if (this.mcq) {
      // Iterate over each choice
      this.mcq.question.mcqchoice_set = this.mcq.question.mcqchoice_set.sort(
        (a, b) => a.order - b.order
      );
      this.choices = this.mcq.question.mcqchoice_set.map((choice, i) => {
        // All users who responded with this choice
        const choiceRespondents = this.mcq.mcqactivityuseranswer_set.filter(
          answer => answer.answer === choice.id
        );

        let isUserSelected = false;
        // Is the user in the respondents who responded with this choice
        const userChoiceRespondent = choiceRespondents.filter(
          answer => answer.user.id === this.userId
        );

        if (userChoiceRespondent.length === 1) {
          isUserSelected = true;
        }
        return {
          text: choice.choice_text,
          isUserSelected: isUserSelected,
          isCorrect: choice.is_correct
        };
      });
    }
  }

  ngOnChanges() {}
}

const mcq = {
  id: 514,
  question: {
    id: 74,
    question: 'A pitch must be able to answer...',
    mcqchoice_set: [
      {
        id: 284,
        order: 4,
        choice_text: 'All of the above ',
        is_correct: true,
        explanation: 'Correct'
      },
      {
        id: 283,
        order: 3,
        choice_text: 'What impact your solution has',
        is_correct: false,
        explanation: 'Nope!'
      },
      {
        id: 282,
        order: 2,
        choice_text: 'How you solve that problem',
        is_correct: false,
        explanation: 'Nope!'
      },
      {
        id: 281,
        order: 1,
        choice_text: 'What problem you help with',
        is_correct: false,
        explanation: 'Not quite!'
      },
      {
        id: 280,
        order: 0,
        choice_text: 'Who you’re helping',
        is_correct: false,
        explanation: 'Incorrect'
      }
    ]
  },
  mcqactivityuseranswer_set: [
    {
      user: {
        id: 2,
        username: 'matt',
        first_name: 'Matt',
        last_name: 'Parson',
        email: 'matt@mybenji.com',
        verified_email: false,
        job_title: 'CEO',
        organization_name: 'Benji',
        orggroup_name: 'Sales',
        organization: 1,
        orggroup: 1,
        local_admin_permission: true,
        participant_permission: true
      },
      answer: 284
    },
    {
      user: {
        id: 8,
        username: 'khan',
        first_name: 'khan',
        last_name: '',
        email: '',
        verified_email: false,
        job_title: null,
        organization_name: null,
        orggroup_name: null,
        organization: null,
        orggroup: null,
        local_admin_permission: false,
        participant_permission: true
      },
      answer: 283
    }
  ],
  activity_type: 'MCQActivity'
};
