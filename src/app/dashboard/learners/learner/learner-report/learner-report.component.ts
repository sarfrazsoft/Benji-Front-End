import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearnerService } from 'src/app/dashboard/learners/services';
import { ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import {
  ActivityReport,
  FeedbackGraphQuestion,
  PitchoMaticBlank,
  PitchoMaticGroupMember
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-learner-report',
  templateUrl: './learner-report.component.html',
  styleUrls: ['./learner-report.component.scss']
})
export class LearnerReportComponent implements OnInit {
  fback: any = feedback.feedback.feedbackquestion_set;
  pitchText = '';
  userId = 2;
  arr: Array<FeedbackGraphQuestion> = [];
  dataExists = true;
  constructor(
    private learnerService: LearnerService,
    private contextService: ContextService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.data.forEach((data: any) => {
      // this.userId = data.dashData.user.id;
      // console.log(this.userId);
    });
  }

  ngOnInit() {
    // this.userId = this.contextService.user;
    // this.pitchText = this.getUserPitchPrompt();
    // this.formatData();
    // this.learnerService.getReports('73103').subscribe((res: any) => {
    //   console.log(res);
    // this.res.pom = this.data;
    // // Iterate over each item in array
    // res.forEach((act: ActivityReport) => {
    //   if (act.activity_type === ActivityTypes.mcq) {
    //     const mcqComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
    //       McqsComponent
    //     );
    //     const component = this.entry.createComponent(mcqComponentFactory);
    //     component.instance.data = act;
    //   } else if (act.activity_type === ActivityTypes.feedback) {
    //     const feedbackComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
    //       FeedbackComponent
    //     );
    //     const component = this.entry.createComponent(
    //       feedbackComponentFactory
    //     );
    //     component.instance.data = act;
    //   } else if (act.activity_type === ActivityTypes.pitchoMatic) {
    //     // const pomComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
    //     //   PitchOMaticComponent
    //     // );
    //     // const component = this.entry.createComponent(pomComponentFactory);
    //     // component.instance.data = act;
    //   } else if (act.activity_type === ActivityTypes.buildAPitch) {
    //     // const bapComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
    //     //   BuildAPitchComponent
    //     // );
    //     // const component = this.entry.createComponent(bapComponentFactory);
    //     // component.instance.data = act;
    //   }
    // });
    // });
  }

  // getUserPitchPrompt() {
  //   const blank_set: Array<PitchoMaticBlank> = pom.pitchomaticblank_set;
  //   blank_set.sort((a, b) => a.order - b.order);

  //   const currentUserID = 2;
  //   let currentMember: any;

  //   pom.pitchomaticgroupmembers.forEach(member => {
  //     if (member.user.id === currentUserID) {
  //       currentMember = member;
  //     }
  //   });

  //   const pitch_set = [];

  //   blank_set.forEach(blank => {
  //     const choice = currentMember.pitch.pitchomaticgroupmemberpitchchoice_set.filter(
  //       el => {
  //         return el.pitchomaticblank === blank.id;
  //       }
  //     )[0].choice;

  //     const value = blank.pitchomaticblankchoice_set.filter(el => {
  //       return el.id === choice;
  //     })[0].value;

  //     pitch_set.push({
  //       id: blank.id,
  //       label: blank.label,
  //       order: blank.order,
  //       value: value
  //     });
  //   });

  //   let pitchText = '';
  //   const helpText = ['Pitch', 'to', 'using'];
  //   pitch_set.forEach((v, i) => {
  //     pitchText =
  //       pitchText +
  //       helpText[i] +
  //       ' <em class="primary-color">' +
  //       v.value +
  //       '</em> ';
  //   });
  //   return pitchText;
  // }

  // formatData() {
  //   const data = pom.feedbackquestion_set.forEach(question => {
  //     const userData = pom.pitchomaticgroupmembers.filter(
  //       gm => gm.user.id === this.userId
  //     );
  //     if (userData.length > 0) {
  //       this.dataExists = false;
  //       return;
  //     }
  //     const questionRatings = userData[0].pitchomaticfeedback_set.filter(
  //       fb => fb.feedbackquestion === question.id
  //     );
  //     // how many users gave our guy agree disagree ratings
  //     const assessments = [0, 0, 0, 2, 3];
  //     const textAnswers = [];

  //     questionRatings.forEach(answer => {
  //       assessments[answer.rating_answer - 1]++;
  //       textAnswers.push(answer.text_answer);
  //     });

  //     this.arr.push({
  //       question_text: question.question_text,
  //       assessments: assessments,
  //       labels: [
  //         'Strongly Disagree',
  //         'Disagree',
  //         'Neutral',
  //         'Agree',
  //         'Strongly Agree'
  //       ],
  //       is_combo: question.is_combo,
  //       combo_text: question.combo_text,
  //       combo_answers: textAnswers
  //     });
  //   });
  // }
}

const questionsDummyData = [
  {
    question_text: 'Im a sample questions',
    assessments: [0, 0, 0, 2, 3],
    labels: [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree'
    ],
    is_combo: false
  },
  {
    question_text: 'I am a real boy',
    assessments: [0, 0, 5, 2, 3],
    labels: [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree'
    ],
    is_combo: true,
    combo_text: 'Why whyyy whyyy',
    combo_answers: ['3', '4', 'brrr', 'puppies']
  }
];

const feedback = {
  feedback: {
    id: 52,
    feedbackquestion_set: [
      {
        id: 23,
        feedbackuseranswer_set: [
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
            rating_answer: 5,
            text_answer: '5',
            feedbackquestion: 23
          },
          {
            user: {
              id: 6,
              username: 'khana',
              first_name: 'khana',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 23
          },
          {
            user: {
              id: 7,
              username: 'abdullah',
              first_name: 'Abdullah',
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
            rating_answer: 2,
            text_answer: '2',
            feedbackquestion: 23
          },
          {
            user: {
              id: 8,
              username: 'jim',
              first_name: 'Jim',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 23
          }
        ],
        average_rating: '3.75',
        question_type: 'rating_agreedisagree',
        question_text: 'I can evaluate the quality of a pitch.',
        is_combo: true,
        combo_text: 'Why is that?',
        feedbackactivity: 52,
        pitchomaticactivity: null
      },
      {
        id: 24,
        feedbackuseranswer_set: [
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
            rating_answer: 5,
            text_answer: '5',
            feedbackquestion: 24
          },
          {
            user: {
              id: 6,
              username: 'khana',
              first_name: 'khana',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 24
          },
          {
            user: {
              id: 7,
              username: 'abdullah',
              first_name: 'Abdullah',
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
            rating_answer: 2,
            text_answer: '2',
            feedbackquestion: 24
          },
          {
            user: {
              id: 8,
              username: 'jim',
              first_name: 'Jim',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 24
          }
        ],
        average_rating: '3.75',
        question_type: 'rating_agreedisagree',
        question_text: 'I can deliver a clear, concise, and compelling pitch.',
        is_combo: true,
        combo_text: null,
        feedbackactivity: 52,
        pitchomaticactivity: null
      },
      {
        id: 25,
        feedbackuseranswer_set: [
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
            rating_answer: 5,
            text_answer: '5',
            feedbackquestion: 25
          },
          {
            user: {
              id: 6,
              username: 'khana',
              first_name: 'khana',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 25
          },
          {
            user: {
              id: 7,
              username: 'abdullah',
              first_name: 'Abdullah',
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
            rating_answer: 2,
            text_answer: '2',
            feedbackquestion: 25
          },
          {
            user: {
              id: 8,
              username: 'jim',
              first_name: 'Jim',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 25
          }
        ],
        average_rating: '3.75',
        question_type: 'rating_agreedisagree',
        question_text: 'I can adjust my pitch to fit different situations.',
        is_combo: true,
        combo_text: null,
        feedbackactivity: 52,
        pitchomaticactivity: null
      }
    ],
    titlecomponent: {
      title: 'Before we begin',
      title_image: 'emoji://memo',
      screen_instructions: 'Fill out the form on your phone',
      participant_instructions:
        'How do you feel about your pitching skills now?'
    },
    activity_type: 'FeedbackActivity'
  }
};

const feedback2 = {
  feedback: {
    id: 52,
    feedbackquestion_set: [
      {
        id: 23,
        feedbackuseranswer_set: [
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
            rating_answer: 5,
            text_answer: '5',
            feedbackquestion: 23
          },
          {
            user: {
              id: 6,
              username: 'khana',
              first_name: 'khana',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 23
          },
          {
            user: {
              id: 7,
              username: 'abdullah',
              first_name: 'Abdullah',
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
            rating_answer: 2,
            text_answer: '2',
            feedbackquestion: 23
          },
          {
            user: {
              id: 8,
              username: 'jim',
              first_name: 'Jim',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 23
          }
        ],
        average_rating: '3.75',
        question_type: 'rating_agreedisagree',
        question_text: 'I can evaluate the quality of a pitch.',
        is_combo: true,
        combo_text: 'Why is that?',
        feedbackactivity: 52,
        pitchomaticactivity: null
      },
      {
        id: 24,
        feedbackuseranswer_set: [
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
            rating_answer: 5,
            text_answer: '5',
            feedbackquestion: 24
          },
          {
            user: {
              id: 6,
              username: 'khana',
              first_name: 'khana',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 24
          },
          {
            user: {
              id: 7,
              username: 'abdullah',
              first_name: 'Abdullah',
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
            rating_answer: 2,
            text_answer: '2',
            feedbackquestion: 24
          },
          {
            user: {
              id: 8,
              username: 'jim',
              first_name: 'Jim',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 24
          }
        ],
        average_rating: '3.75',
        question_type: 'rating_agreedisagree',
        question_text: 'I can deliver a clear, concise, and compelling pitch.',
        is_combo: true,
        combo_text: null,
        feedbackactivity: 52,
        pitchomaticactivity: null
      },
      {
        id: 25,
        feedbackuseranswer_set: [
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
            rating_answer: 5,
            text_answer: '5',
            feedbackquestion: 25
          },
          {
            user: {
              id: 6,
              username: 'khana',
              first_name: 'khana',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 25
          },
          {
            user: {
              id: 7,
              username: 'abdullah',
              first_name: 'Abdullah',
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
            rating_answer: 2,
            text_answer: '2',
            feedbackquestion: 25
          },
          {
            user: {
              id: 8,
              username: 'jim',
              first_name: 'Jim',
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
            rating_answer: 4,
            text_answer: '4',
            feedbackquestion: 25
          }
        ],
        average_rating: '3.75',
        question_type: 'rating_agreedisagree',
        question_text: 'I can adjust my pitch to fit different situations.',
        is_combo: true,
        combo_text: null,
        feedbackactivity: 52,
        pitchomaticactivity: null
      }
    ],
    titlecomponent: {
      title: 'Before we begin',
      title_image: 'emoji://memo',
      screen_instructions: 'Fill out the form on your phone',
      participant_instructions:
        'How do you feel about your pitching skills now?'
    },
    activity_type: 'FeedbackActivity'
  }
};
