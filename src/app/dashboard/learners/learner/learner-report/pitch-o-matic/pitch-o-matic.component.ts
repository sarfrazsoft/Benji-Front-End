import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'benji-learner-pitch-o-matic',
  templateUrl: './pitch-o-matic.component.html',
  styleUrls: ['./pitch-o-matic.component.scss']
})
export class PitchOMaticComponent implements OnInit {
  // fback: any = feedback.feedback.feedbackquestion_set;
  @Input() fback: any;
  pitchText = '';
  userId = 2;
  arr: Array<FeedbackGraphQuestion> = [];
  dataExists = true;
  constructor(
    private learnerService: LearnerService,
    private contextService: ContextService,
    private activatedRoute: ActivatedRoute
  ) {
    // this.activatedRoute.data.forEach((data: any) => {
    //   this.userId = data.dashData.user.id;
    //   this.userId = 2;
    //   console.log(this.userId);
    // });
  }

  ngOnInit() {
    // this.userId = this.contextService.user;
    this.pitchText = this.getUserPitchPrompt();
    this.formatData();
    this.learnerService.getReports('73103').subscribe((res: any) => {
      console.log(res);
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
    });
  }

  getUserPitchPrompt() {
    const blank_set: Array<PitchoMaticBlank> = pom.pitchomaticblank_set;
    blank_set.sort((a, b) => a.order - b.order);

    const currentUserID = 2;
    let currentMember: any;

    pom.pitchomaticgroupmembers.forEach(member => {
      if (member.user.id === currentUserID) {
        currentMember = member;
      }
    });

    const pitch_set = [];

    blank_set.forEach(blank => {
      const choice = currentMember.pitch.pitchomaticgroupmemberpitchchoice_set.filter(
        el => {
          return el.pitchomaticblank === blank.id;
        }
      )[0].choice;

      const value = blank.pitchomaticblankchoice_set.filter(el => {
        return el.id === choice;
      })[0].value;

      pitch_set.push({
        id: blank.id,
        label: blank.label,
        order: blank.order,
        value: value
      });
    });

    let pitchText = '';
    const helpText = ['Pitch', 'to', 'using'];
    pitch_set.forEach((v, i) => {
      pitchText =
        pitchText +
        helpText[i] +
        ' <em class="primary-color">' +
        v.value +
        '</em> ';
    });
    return pitchText;
  }

  formatData() {
    const data = pom.feedbackquestion_set.forEach(question => {
      const userData = pom.pitchomaticgroupmembers.filter(
        gm => gm.user.id === this.userId
      );
      if (userData.length === 0) {
        this.dataExists = false;
        return;
      }
      const questionRatings = userData[0].pitchomaticfeedback_set.filter(
        fb => fb.feedbackquestion === question.id
      );
      // how many users gave our guy agree disagree ratings
      const assessments = [0, 0, 0, 2, 3];
      const textAnswers = [];

      questionRatings.forEach(answer => {
        assessments[answer.rating_answer - 1]++;
        textAnswers.push(answer.text_answer);
      });

      this.arr.push({
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
        combo_answers: textAnswers
      });
    });
  }
}

const pom = {
  instructions: 'Generate your pitches, brainstorm, pitch and then vote!',
  pitchomaticblank_set: [
    {
      id: 7,
      order: 0,
      label: 'You are pitching:',
      pitchomaticblankchoice_set: [
        {
          id: 45,
          value: 'Coca Cola'
        },
        {
          id: 46,
          value: 'SpaceX'
        },
        {
          id: 47,
          value: 'Tesla'
        },
        {
          id: 48,
          value: 'Disney'
        },
        {
          id: 49,
          value: 'Apple'
        },
        {
          id: 50,
          value: 'McDonalds'
        },
        {
          id: 51,
          value: 'Netflix'
        },
        {
          id: 52,
          value: 'WestJet'
        },
        {
          id: 53,
          value: 'IKEA'
        },
        {
          id: 54,
          value: 'Walmart'
        },
        {
          id: 55,
          value: 'Facebook'
        },
        {
          id: 56,
          value: 'NHL'
        }
      ]
    },
    {
      id: 8,
      order: 1,
      label: 'You are pitching to:',
      pitchomaticblankchoice_set: [
        {
          id: 57,
          value: 'a CTO'
        },
        {
          id: 58,
          value: 'a venture capitalist'
        },
        {
          id: 59,
          value: 'a 5 year old'
        },
        {
          id: 60,
          value: 'an 86 year old grandmother'
        },
        {
          id: 61,
          value: 'a group of college students'
        },
        {
          id: 62,
          value: 'academics at a conference'
        },
        {
          id: 63,
          value: 'an elevator full of random people'
        }
      ]
    },
    {
      id: 9,
      order: 2,
      label: 'And the technique you need to use is:',
      pitchomaticblankchoice_set: [
        {
          id: 64,
          value: 'a story'
        },
        {
          id: 65,
          value: 'a surprising fact'
        },
        {
          id: 66,
          value: 'an analogy'
        }
      ]
    }
  ],
  feedbackquestion_set: [
    {
      id: 26,
      question_type: 'rating_agreedisagree',
      question_text: 'The pitch was compelling',
      is_combo: false,
      combo_text: null
    },
    {
      id: 27,
      question_type: 'rating_agreedisagree',
      question_text: 'The pitch answered all the essential questions',
      is_combo: false,
      combo_text: null
    },
    {
      id: 28,
      question_type: 'rating_agreedisagree',
      question_text: 'Overall, the pitch was excellent',
      is_combo: true,
      combo_text: null
    }
  ],
  pitchomaticgroupmembers: [
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
      pitch_prep_text: 'how am I supposed to pitch disney. it\'s like a lee',
      pitch: {
        pitchomaticgroupmemberpitchchoice_set: [
          {
            pitchomaticblank: 7,
            choice: 55
          },
          {
            pitchomaticblank: 8,
            choice: 61
          },
          {
            pitchomaticblank: 9,
            choice: 65
          }
        ]
      },
      pitchomaticfeedback_set: [
        {
          user: 2,
          feedbackquestion: 26,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 2,
          feedbackquestion: 27,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 2,
          feedbackquestion: 28,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 6,
          feedbackquestion: 26,
          rating_answer: 3,
          text_answer: '3'
        },
        {
          user: 6,
          feedbackquestion: 27,
          rating_answer: 3,
          text_answer: '3'
        },
        {
          user: 6,
          feedbackquestion: 28,
          rating_answer: 3,
          text_answer: '3'
        },
        {
          user: 8,
          feedbackquestion: 26,
          rating_answer: 4,
          text_answer: '4'
        },
        {
          user: 8,
          feedbackquestion: 27,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 8,
          feedbackquestion: 28,
          rating_answer: 5,
          text_answer: '5'
        }
      ]
    },
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
      pitch_prep_text: 'my notes are my notes and nobody else should see them',
      pitch: {
        pitchomaticgroupmemberpitchchoice_set: [
          {
            pitchomaticblank: 7,
            choice: 55
          },
          {
            pitchomaticblank: 8,
            choice: 59
          },
          {
            pitchomaticblank: 9,
            choice: 65
          }
        ]
      },
      pitchomaticfeedback_set: [
        {
          user: 7,
          feedbackquestion: 26,
          rating_answer: 2,
          text_answer: '2'
        },
        {
          user: 7,
          feedbackquestion: 27,
          rating_answer: 2,
          text_answer: '2'
        },
        {
          user: 7,
          feedbackquestion: 28,
          rating_answer: 1,
          text_answer: '1'
        },
        {
          user: 6,
          feedbackquestion: 26,
          rating_answer: 1,
          text_answer: '1'
        },
        {
          user: 6,
          feedbackquestion: 27,
          rating_answer: 1,
          text_answer: ''
        },
        {
          user: 6,
          feedbackquestion: 28,
          rating_answer: 1,
          text_answer: 'matt bhain ne bari pitch ki'
        }
      ]
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
      pitch_prep_text: 'how am I supposed to pitch disney. it\'s like a lee',
      pitch: {
        pitchomaticgroupmemberpitchchoice_set: [
          {
            pitchomaticblank: 7,
            choice: 51
          },
          {
            pitchomaticblank: 8,
            choice: 60
          },
          {
            pitchomaticblank: 9,
            choice: 64
          }
        ]
      },
      pitchomaticfeedback_set: [
        {
          user: 7,
          feedbackquestion: 26,
          rating_answer: 4,
          text_answer: '4'
        },
        {
          user: 7,
          feedbackquestion: 27,
          rating_answer: 4,
          text_answer: '4'
        },
        {
          user: 7,
          feedbackquestion: 28,
          rating_answer: 3,
          text_answer: '3'
        },
        {
          user: 6,
          feedbackquestion: 26,
          rating_answer: 1,
          text_answer: '1'
        },
        {
          user: 6,
          feedbackquestion: 27,
          rating_answer: 1,
          text_answer: '1'
        },
        {
          user: 6,
          feedbackquestion: 28,
          rating_answer: 1,
          text_answer: '1'
        },
        {
          user: 2,
          feedbackquestion: 26,
          rating_answer: 2,
          text_answer: '2'
        },
        {
          user: 2,
          feedbackquestion: 27,
          rating_answer: 2,
          text_answer: '2'
        },
        {
          user: 2,
          feedbackquestion: 28,
          rating_answer: 2,
          text_answer: '2'
        }
      ]
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
      pitch_prep_text:
        'how am I supposed to pitch disney. it\'s like a leech dd',
      pitch: {
        pitchomaticgroupmemberpitchchoice_set: [
          {
            pitchomaticblank: 7,
            choice: 48
          },
          {
            pitchomaticblank: 8,
            choice: 63
          },
          {
            pitchomaticblank: 9,
            choice: 66
          }
        ]
      },
      pitchomaticfeedback_set: [
        {
          user: 2,
          feedbackquestion: 26,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 2,
          feedbackquestion: 27,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 2,
          feedbackquestion: 28,
          rating_answer: 4,
          text_answer: '4'
        },
        {
          user: 7,
          feedbackquestion: 26,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 7,
          feedbackquestion: 27,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 7,
          feedbackquestion: 28,
          rating_answer: 5,
          text_answer: '5'
        },
        {
          user: 8,
          feedbackquestion: 26,
          rating_answer: 2,
          text_answer: '2'
        },
        {
          user: 8,
          feedbackquestion: 27,
          rating_answer: 3,
          text_answer: '3'
        },
        {
          user: 8,
          feedbackquestion: 28,
          rating_answer: 3,
          text_answer: '3'
        }
      ]
    }
  ],
  activity_type: 'PitchoMaticActivity'
};
