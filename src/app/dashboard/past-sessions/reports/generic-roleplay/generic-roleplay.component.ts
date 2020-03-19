import { Component, Input, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import {
  ActivityReport,
  FeedbackQuestion,
  User
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-generic-roleplay',
  templateUrl: './generic-roleplay.component.html',
  styleUrls: ['./generic-roleplay.component.scss']
})
export class GenericRoleplayComponent implements OnInit {
  @Input() data: ActivityReport;
  salesmanTask: string;
  questions = [];
  showUserReport = false;
  salesmenUsers: Array<User>;
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(updatedUserFilter => {
      this.checkUsers();
    });

    this.setupData();
  }

  checkUsers() {
    const salesman = this.data.grplay.genericroleplayrole_set.find(
      el => el.name === 'Salesman'
    );
    let salesmanID;
    if (salesman) {
      salesmanID = salesman.id;
    }

    // iterate over all the users and get the users who had salesman role
    const salesmen = this.data.grplay.genericroleplayuser_set.filter(
      el => el.role === salesmanID
    );

    // salesmen have been found
    this.salesmenUsers = this.data.joined_users.filter(el => {
      return salesmen.find(role => el.id === role.benjiuser_id);
    });
    const finU = this.pastSessionService.filteredInUsers;
    this.showUserReport = false;
    this.salesmenUsers.forEach(s => {
      if (finU.find(el => el === s.id)) {
        this.showUserReport = true;
      }
    });
  }

  setupData() {
    // get the salesman role
    const salesman = this.data.grplay.genericroleplayrole_set.find(
      el => el.name === 'Salesman'
    );
    this.salesmanTask = salesman.instructions;
    let salesmanID;
    if (salesman) {
      salesmanID = salesman.id;
    }

    // iterate over all the users and get the users who had salesman role
    const salesmen = this.data.grplay.genericroleplayuser_set.filter(
      el => el.role === salesmanID
    );

    // salesmen have been found
    this.salesmenUsers = this.data.joined_users.filter(el => {
      return salesmen.find(role => el.id === role.benjiuser_id);
    });

    const questionList: Array<FeedbackQuestion> = [];
    this.questions = [];
    this.data.grplay.genericroleplayrole_set.forEach(role => {
      questionList.push(...role.feedbackquestions);
    });

    const feedbackList = this.data.grplay.feedback;
    questionList.forEach(question => {
      const assessments = [];
      const responsesForQuestion = feedbackList.filter(
        fb => fb.feedbackquestion === question.id
      );

      responsesForQuestion.forEach(res => {
        const userGroup = this.getUserGroup(res.benji_user);
        userGroup.usergroupuser_set.forEach(user => {
          const fbReceiever = this.salesmenUsers.find(
            u => user.user.id === u.id
          );
          if (fbReceiever) {
            assessments.push({
              user: fbReceiever,
              rating: res.rating_answer,
              text: res.text_answer
            });
          }
        });
      });
      this.questions.push({
        question_text: question.question_text,
        assessments: assessments,
        labels: [
          'Strongly Disagree',
          'Disagree',
          'Neutral',
          'Agree',
          'Strongly Agree'
        ],
        is_combo: question.is_combo,
        combo_text: question.combo_text,
        question_type: question.question_type
      });
    });
  }

  getUserGroup(userId: number) {
    let groups = this.data.grplay.groups;
    groups = groups.filter(group => {
      return group.usergroupuser_set.find(groupSet => {
        return groupSet.user.id === userId;
      });
    });

    if (groups) {
      return groups[0];
    } else {
      return null;
    }
  }
}

// other way of solving it can be
// for each question
//   filter the responses for that question from the feedback list
//   for each response
//     find the user it was given to by finding out benjiuser_id's group
//     from that group only pick the person who has his ID in
//     the genericroleplayuser_set (Filtered by roleid === salesman)

// so we had a group of 9 people who ran the generic roleplay
// In the first 1st round 3 people were salesmen
// Below is the feedback they got from other people in the first round
export const salesmanFeedback = [
  {
    question_text: 'Were you convinced by the salesman?',
    assessments: [
      // this user got rating 4 for this question.
      // only include here if the user is selected in the selection
      {
        user: {
          id: 12,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 5,
        text: 'salesman was amazing'
      },
      {
        user: {
          id: 13,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 5,
        text: 'I sure was convinced'
      },
      {
        user: {
          id: 14,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 5,
        text: 'I would buy from him'
      }
    ],
    labels: [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree'
    ],
    is_combo: true,
    combo_text: 'What made you say that?'
  },
  {
    question_text: 'Were your concerns addressed?',
    assessments: [
      // this user got rating 4 for this question.
      // only include here if the user is selected in the selection
      {
        user: {
          id: 16,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 4
      },
      {
        user: {
          id: 17,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 5
      },
      {
        user: {
          id: 18,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 4
      }
    ],
    labels: [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree'
    ],
    is_combo: true,
    combo_text: 'What made you say that?'
  },
  {
    question_text: 'Was the salesman compassionate?',
    assessments: [
      // this user got rating 4 for this question.
      // only include here if the user is selected in the selection
      {
        user: {
          id: 12,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 4
      },
      {
        user: {
          id: 13,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 5
      },
      {
        user: {
          id: 14,
          username: 'participant1atgmaildotcom',
          first_name: 'participant1',
          last_name: 'xx',
          email: 'participant1@gmail.com',
          verified_email: false,
          job_title: 'dd',
          organization_name: 'Benji',
          orggroup_name: 'Sales',
          organization: 1,
          orggroup: 1,
          local_admin_permission: false,
          participant_permission: true
        },
        rating: 4
      }
    ],
    labels: [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree'
    ],
    is_combo: true,
    combo_text: 'What made you say that?'
  }
];
