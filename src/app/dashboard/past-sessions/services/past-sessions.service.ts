import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import {
  ActivityReport,
  BuildAPitchReport,
  FeedbackReport,
  MCQReport,
  PitchOMaticReport,
  SessionReport,
  User
} from 'src/app/services/backend/schema';

@Injectable()
export class PastSessionsService {
  filteredInUsers: Array<number> = [];
  joinedUsers: Array<User>;
  filteredInUsers$ = new BehaviorSubject<Array<number>>([]);

  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  addToFilteredInList(id: number) {
    if (this.filteredInUsers.includes(id)) {
      const index = this.filteredInUsers.indexOf(id);
      if (index !== -1) {
        this.filteredInUsers.splice(index, 1);
        this.filteredInUsers$.next(this.filteredInUsers);
      }
    } else {
      this.filteredInUsers.unshift(id);
      this.filteredInUsers$.next(this.filteredInUsers);
    }
    if (this.filteredInUsers.length > this.joinedUsers.length) {
      this.filteredInUsers = this.filteredInUsers.slice(
        0,
        this.joinedUsers.length
      );
      this.filteredInUsers$.next(this.filteredInUsers);
    }
  }

  // api/course_details/lesson_run/{room_code}/summary/
  getReports(id: string): Observable<any> {
    return this.http
      .get(global.apiRoot + '/course_details/lesson_run/' + id + '/summary')
      .pipe(
        map((res: SessionReport) => {
          // this.data = activityResult3;
          res = activityResult3 as SessionReport;
          const arr: Array<ActivityReport> = [];

          this.joinedUsers = res.joined_users;
          res.joined_users.forEach(ju => {
            this.filteredInUsers.push(ju.id);
          });

          arr.push(res);

          // Iterate over each activity in order and
          // push them to the array
          res.activity_results.forEach((act, i) => {
            if (act.activity_type === ActivityTypes.mcq) {
              arr.push({
                ...res,
                mcqs: [act] as Array<MCQReport>,
                activity_type: ActivityTypes.mcq
              });
            } else if (act.activity_type === ActivityTypes.feedback) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.feedback,
                feedback: act as FeedbackReport
              });
            } else if (act.activity_type === ActivityTypes.pitchoMatic) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.pitchoMatic,
                pom: act as PitchOMaticReport
              });
            } else if (act.activity_type === ActivityTypes.buildAPitch) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.buildAPitch,
                bap: act as BuildAPitchReport
              });
            } else if (act.activity_type === ActivityTypes.brainStorm) {
              arr.push({
                ...res,
                activity_type: ActivityTypes.brainStorm,
                brainstorm: act
              });
            }
          });
          return arr;
        })
      );
  }

  getLearners(sort: string, order: string, page: number): Observable<User> {
    // django expects page index starting from 1
    const request = global.apiRoot + '/tenants/users/?page=' + (page + 1);
    return this.http.get<User>(request);
  }

  // /api/course_details/lesson_run/
  getPastSessions(sort: string, order: string, page: number): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/lesson_run/').pipe(
      map(res => {
        console.log(res);
        return res;
      })
    );
  }

  addLearners(emails: string) {
    const request = global.apiRoot + '/tenants/users/';
    return this.http.get<User>(request);
  }

  // getCourses(): Observable<any> {
  //   return this.http.get(global.apiRoot + '/course_details/course/').pipe(
  //     map(res => {
  //       return res;
  //     })
  //   );
  // }
}

// pitcho matic activity

const activityResult = {
  id: 18,
  start_time: '2019-09-13T16:12:39.557183-04:00',
  end_time: '2019-09-13T16:29:30.493122-04:00',
  lessonrun_code: 21484,
  joined_users: [
    {
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
    {
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
    }
  ],
  host: {
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
  activity_results: [
    {
      id: 529,
      feedbackquestion_set: [
        {
          id: 92,
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 92
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 92
            }
          ],
          average_rating: '3.50',
          question_type: 'rating_agreedisagree',
          question_text:
            'What I learned in this session will improve my skills.',
          is_combo: true,
          combo_text: 'Why is that?',
          feedbackactivity: 529,
          pitchomaticactivity: null
        },
        {
          id: 93,
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
              feedbackquestion: 93
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 93
            }
          ],
          average_rating: '5.00',
          question_type: 'rating_agreedisagree',
          question_text: 'I found this session fun',
          is_combo: true,
          combo_text: null,
          feedbackactivity: 529,
          pitchomaticactivity: null
        }
      ],
      titlecomponent: {
        title: 'Please leave some feedback for us!',
        title_image: 'emoji://memo',
        screen_instructions:
          'We\'d really appreciate your feedback. Submit on your phone- it’ll only take a minute!',
        participant_instructions: 'What did you think about today\'s lesson?'
      },
      activity_type: 'FeedbackActivity'
    },
    {
      id: 526,
      feedbackquestion_set: [
        {
          id: 89,
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
              feedbackquestion: 89
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 89
            }
          ],
          average_rating: '5.00',
          question_type: 'rating_agreedisagree',
          question_text: 'I can evaluate the quality of a pitch.',
          is_combo: false,
          combo_text: 'Why is that?',
          feedbackactivity: 526,
          pitchomaticactivity: null
        },
        {
          id: 90,
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
              feedbackquestion: 90
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 90
            }
          ],
          average_rating: '5.00',
          question_type: 'rating_agreedisagree',
          question_text:
            'I can deliver a clear, concise, and compelling pitch.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 526,
          pitchomaticactivity: null
        },
        {
          id: 91,
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
              feedbackquestion: 91
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 91
            }
          ],
          average_rating: '5.00',
          question_type: 'rating_agreedisagree',
          question_text: 'I can adjust my pitch to fit different situations.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 526,
          pitchomaticactivity: null
        }
      ],
      titlecomponent: {
        title: 'What about now?',
        title_image: 'emoji://memo',
        screen_instructions: 'Fill out the form on your phone',
        participant_instructions:
          'How do you feel about your pitching skills now?'
      },
      activity_type: 'FeedbackActivity'
    },
    {
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
          answer: 282
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
    },
    {
      id: 513,
      question: {
        id: 73,
        question: 'An elevator pitch should last how long?',
        mcqchoice_set: [
          {
            id: 279,
            order: 3,
            choice_text: 'However long is necessary',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 278,
            order: 2,
            choice_text: '30-60 seconds',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 277,
            order: 1,
            choice_text: '20-30 seconds',
            is_correct: true,
            explanation: 'Yup!'
          },
          {
            id: 276,
            order: 0,
            choice_text: '10-15 seconds',
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
          answer: 277
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
          answer: 277
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 512,
      question: {
        id: 72,
        question: 'True or false: an elevator pitch is a sales pitch.',
        mcqchoice_set: [
          {
            id: 275,
            order: 1,
            choice_text: 'False',
            is_correct: true,
            explanation: 'Correct'
          },
          {
            id: 274,
            order: 0,
            choice_text: 'True',
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
          answer: 275
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
          answer: 275
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 511,
      question: {
        id: 71,
        question: 'How can you make your pitch more memorable?',
        mcqchoice_set: [
          {
            id: 273,
            order: 3,
            choice_text: 'All of the above',
            is_correct: true,
            explanation: 'Correct!'
          },
          {
            id: 272,
            order: 2,
            choice_text: 'Make it short',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 271,
            order: 1,
            choice_text: 'Make it surprising',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 270,
            order: 0,
            choice_text: 'Make it relatable',
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
          answer: 273
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
          answer: 273
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 510,
      question: {
        id: 70,
        question: 'What are the three C\'s of a good pitch?',
        mcqchoice_set: [
          {
            id: 269,
            order: 2,
            choice_text: 'Compelling, charismatic, clear',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 268,
            order: 1,
            choice_text: 'Clear, catchy, concise',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 267,
            order: 0,
            choice_text: 'Clear, compelling, concise',
            is_correct: true,
            explanation: 'Correct!'
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
          answer: 269
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
          answer: 269
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      winning_user: {
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
      buildapitchblank_set: [
        {
          id: 26,
          order: 0,
          label: ' At',
          temp_text: 'company name',
          help_text: ' What company are you pitching?'
        },
        {
          id: 27,
          order: 1,
          label: 'we help',
          temp_text: 'the audience',
          help_text:
            ' Who do you help? Try and be as specific as possible (e.g. demographics, industry, size)'
        },
        {
          id: 28,
          order: 2,
          label: 'with',
          temp_text: 'the problem',
          help_text:
            'What needs, challenges and frustrations do your customers have?'
        },
        {
          id: 29,
          order: 3,
          label: 'by',
          temp_text: 'the solution',
          help_text: 'How do you solve your target customer’s problem?'
        },
        {
          id: 30,
          order: 4,
          label: 'because',
          temp_text: 'the why',
          help_text: 'Why is this problem worth solving?'
        }
      ],
      pitch_summaries: [
        {
          user: 2,
          buildapitchentry_set: [
            {
              buildapitchblank: 26,
              value: 'a'
            },
            {
              buildapitchblank: 27,
              value: 'b'
            },
            {
              buildapitchblank: 28,
              value: 'c'
            },
            {
              buildapitchblank: 29,
              value: 'd'
            },
            {
              buildapitchblank: 30,
              value: 'e'
            }
          ],
          votes: 2
        },
        {
          user: 8,
          buildapitchentry_set: [
            {
              buildapitchblank: 26,
              value: 'f'
            },
            {
              buildapitchblank: 27,
              value: 'g'
            },
            {
              buildapitchblank: 28,
              value: 'h'
            },
            {
              buildapitchblank: 29,
              value: 'i'
            },
            {
              buildapitchblank: 30,
              value: 'j'
            }
          ],
          votes: 0
        }
      ],
      activity_type: 'BuildAPitchActivity'
    },
    {
      id: 506,
      feedbackquestion_set: [
        {
          id: 83,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 83
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 83
            }
          ],
          average_rating: '3.00',
          question_type: 'rating_agreedisagree',
          question_text: 'I can evaluate the quality of a pitch.',
          is_combo: false,
          combo_text: 'Why is that?',
          feedbackactivity: 506,
          pitchomaticactivity: null
        },
        {
          id: 84,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 84
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 84
            }
          ],
          average_rating: '3.50',
          question_type: 'rating_agreedisagree',
          question_text:
            'I can deliver a clear, concise, and compelling pitch.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 506,
          pitchomaticactivity: null
        },
        {
          id: 85,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 85
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 85
            }
          ],
          average_rating: '3.00',
          question_type: 'rating_agreedisagree',
          question_text: 'I can adjust my pitch to fit different situations.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 506,
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
    },
    {
      id: 528,
      length: 43.724356,
      activity_type: 'LobbyActivity'
    },
    {
      id: 525,
      length: 9.964878,
      activity_type: 'VideoActivity'
    },
    {
      instructions: 'Generate your pitches, brainstorm, pitch and then vote!',
      pitchomaticblank_set: [
        {
          id: 19,
          order: 0,
          label: 'You are pitching:',
          pitchomaticblankchoice_set: [
            {
              id: 138,
              value: 'Coca Cola'
            },
            {
              id: 139,
              value: 'SpaceX'
            },
            {
              id: 140,
              value: 'Tesla'
            },
            {
              id: 141,
              value: 'Disney'
            },
            {
              id: 142,
              value: 'Apple'
            },
            {
              id: 143,
              value: 'McDonalds'
            },
            {
              id: 144,
              value: 'Netflix'
            },
            {
              id: 145,
              value: 'WestJet'
            },
            {
              id: 146,
              value: 'IKEA'
            },
            {
              id: 147,
              value: 'Walmart'
            },
            {
              id: 148,
              value: 'Facebook'
            },
            {
              id: 149,
              value: 'NHL'
            }
          ]
        },
        {
          id: 20,
          order: 1,
          label: 'You are pitching to:',
          pitchomaticblankchoice_set: [
            {
              id: 150,
              value: 'a CTO'
            },
            {
              id: 151,
              value: 'a venture capitalist'
            },
            {
              id: 152,
              value: 'a 5 year old'
            },
            {
              id: 153,
              value: 'an 86 year old grandmother'
            },
            {
              id: 154,
              value: 'a group of college students'
            },
            {
              id: 155,
              value: 'academics at a conference'
            },
            {
              id: 156,
              value: 'an elevator full of random people'
            }
          ]
        },
        {
          id: 21,
          order: 2,
          label: 'And the technique you need to use is:',
          pitchomaticblankchoice_set: [
            {
              id: 157,
              value: 'a story'
            },
            {
              id: 158,
              value: 'a surprising fact'
            },
            {
              id: 159,
              value: 'an analogy'
            }
          ]
        }
      ],
      feedbackquestion_set: [
        {
          id: 86,
          question_type: 'rating_agreedisagree',
          question_text: 'The pitch was compelling',
          is_combo: false,
          combo_text: null
        },
        {
          id: 87,
          question_type: 'rating_agreedisagree',
          question_text: 'The pitch answered all the essential questions',
          is_combo: false,
          combo_text: null
        },
        {
          id: 88,
          question_type: 'rating_agreedisagree',
          question_text: 'Overall, the pitch was excellent',
          is_combo: true,
          combo_text: null
        }
      ],
      pitchomaticgroupmembers: [
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
          pitch_prep_text: 'Matt wrote this pitch as a test',
          pitch: {
            pitchomaticgroupmemberpitchchoice_set: [
              {
                pitchomaticblank: 19,
                choice: 138
              },
              {
                pitchomaticblank: 20,
                choice: 150
              },
              {
                pitchomaticblank: 21,
                choice: 158
              }
            ]
          },
          pitchomaticfeedback_set: [
            {
              user: 8,
              feedbackquestion: 86,
              rating_answer: 4,
              text_answer: '4'
            },
            {
              user: 8,
              feedbackquestion: 87,
              rating_answer: 5,
              text_answer: '5'
            },
            {
              user: 8,
              feedbackquestion: 88,
              rating_answer: 5,
              text_answer: '5'
            }
          ]
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
          pitch_prep_text: 'Mahin wrote these pitch notes',
          pitch: {
            pitchomaticgroupmemberpitchchoice_set: [
              {
                pitchomaticblank: 19,
                choice: 145
              },
              {
                pitchomaticblank: 20,
                choice: 150
              },
              {
                pitchomaticblank: 21,
                choice: 157
              }
            ]
          },
          pitchomaticfeedback_set: [
            {
              user: 2,
              feedbackquestion: 86,
              rating_answer: 5,
              text_answer: '5'
            },
            {
              user: 2,
              feedbackquestion: 87,
              rating_answer: 5,
              text_answer: '5'
            },
            {
              user: 2,
              feedbackquestion: 88,
              rating_answer: 3,
              text_answer: '3'
            }
          ]
        }
      ],
      activity_type: 'PitchoMaticActivity'
    },
    {
      id: 523,
      length: 16.457316,
      activity_type: 'VideoActivity'
    },
    {
      id: 522,
      length: 8.18005,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 521,
      length: 54.268166,
      activity_type: 'VideoActivity'
    },
    {
      id: 520,
      length: 3.13295,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 519,
      length: 8.690269,
      activity_type: 'VideoActivity'
    },
    {
      id: 518,
      length: 3.369051,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 517,
      length: 4.980677,
      activity_type: 'VideoActivity'
    },
    {
      id: 516,
      length: 4.625612,
      activity_type: 'PairGroupingActivity'
    },
    {
      id: 515,
      length: 5.635346,
      activity_type: 'VideoActivity'
    },
    {
      id: 509,
      length: 42.874684,
      activity_type: 'VideoActivity'
    },
    {
      id: 507,
      length: 3.720349,
      activity_type: 'VideoActivity'
    },
    {
      id: 505,
      length: 4.958442,
      activity_type: 'VideoActivity'
    },
    {
      id: 527,
      length: null,
      activity_type: 'VideoActivity'
    }
  ]
};

const activityResult2 = {
  id: 13,
  start_time: '2019-10-21T15:39:23.219970-04:00',
  end_time: '2019-10-21T16:11:11.667263-04:00',
  lessonrun_code: 73929,
  joined_users: [
    {
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
    {
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
    }
  ],
  host: {
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
  activity_results: [
    {
      id: 396,
      length: 452.156838,
      activity_type: 'LobbyActivity'
    },
    {
      id: 373,
      length: 1300.15638,
      activity_type: 'VideoActivity'
    },
    {
      id: 374,
      feedbackquestion_set: [
        {
          id: 61,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 61
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 61
            }
          ],
          average_rating: null,
          question_type: 'rating_agreedisagree',
          question_text: 'I can evaluate the quality of a pitch.',
          is_combo: false,
          combo_text: 'Why is that?',
          feedbackactivity: 374,
          pitchomaticactivity: null
        },
        {
          id: 62,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 62
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 62
            }
          ],
          average_rating: null,
          question_type: 'rating_agreedisagree',
          question_text:
            'I can deliver a clear, concise, and compelling pitch.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 374,
          pitchomaticactivity: null
        },
        {
          id: 63,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 63
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 63
            }
          ],
          average_rating: null,
          question_type: 'rating_agreedisagree',
          question_text: 'I can adjust my pitch to fit different situations.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 374,
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
    },
    {
      id: 375,
      length: 11.813128,
      activity_type: 'VideoActivity'
    },
    {
      winning_user: {
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
      buildapitchblank_set: [
        {
          id: 26,
          order: 0,
          label: ' At',
          temp_text: 'company name',
          help_text: ' What company are you pitching?'
        },
        {
          id: 27,
          order: 1,
          label: 'we help',
          temp_text: 'the audience',
          help_text:
            ' Who do you help? Try and be as specific as possible (e.g. demographics, industry, size)'
        },
        {
          id: 28,
          order: 2,
          label: 'with',
          temp_text: 'the problem',
          help_text:
            'What needs, challenges and frustrations do your customers have?'
        },
        {
          id: 29,
          order: 3,
          label: 'by',
          temp_text: 'the solution',
          help_text: 'How do you solve your target customer’s problem?'
        },
        {
          id: 30,
          order: 4,
          label: 'because',
          temp_text: 'the why',
          help_text: 'Why is this problem worth solving?'
        }
      ],
      pitch_summaries: [
        {
          user: 2,
          buildapitchentry_set: [
            {
              buildapitchblank: 26,
              value: 'a'
            },
            {
              buildapitchblank: 27,
              value: 'b'
            },
            {
              buildapitchblank: 28,
              value: 'c'
            },
            {
              buildapitchblank: 29,
              value: 'd'
            },
            {
              buildapitchblank: 30,
              value: 'e'
            }
          ],
          votes: 2
        },
        {
          user: 8,
          buildapitchentry_set: [
            {
              buildapitchblank: 26,
              value: 'f'
            },
            {
              buildapitchblank: 27,
              value: 'g'
            },
            {
              buildapitchblank: 28,
              value: 'h'
            },
            {
              buildapitchblank: 29,
              value: 'i'
            },
            {
              buildapitchblank: 30,
              value: 'j'
            }
          ],
          votes: 0
        }
      ],
      activity_type: 'BuildAPitchActivity'
    },
    {
      id: 377,
      length: 1.989839,
      activity_type: 'VideoActivity'
    },
    {
      id: 378,
      question: {
        id: 53,
        question: 'What are the three C\'s of a good pitch?',
        mcqchoice_set: [
          {
            id: 201,
            order: 0,
            choice_text: 'Clear, compelling, concise',
            is_correct: true,
            explanation: 'Correct!'
          },
          {
            id: 202,
            order: 1,
            choice_text: 'Clear, catchy, concise',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 203,
            order: 2,
            choice_text: 'Compelling, charismatic, clear',
            is_correct: false,
            explanation: 'Nope!'
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
          answer: 201
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
          answer: 201
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 379,
      question: {
        id: 54,
        question: 'How can you make your pitch more memorable?',
        mcqchoice_set: [
          {
            id: 204,
            order: 0,
            choice_text: 'Make it relatable',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 205,
            order: 1,
            choice_text: 'Make it surprising',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 206,
            order: 2,
            choice_text: 'Make it short',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 207,
            order: 3,
            choice_text: 'All of the above',
            is_correct: true,
            explanation: 'Correct!'
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
          answer: 207
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
          answer: 206
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 380,
      question: {
        id: 55,
        question: 'True or false: an elevator pitch is a sales pitch.',
        mcqchoice_set: [
          {
            id: 208,
            order: 0,
            choice_text: 'True',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 209,
            order: 1,
            choice_text: 'False',
            is_correct: true,
            explanation: 'Correct'
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
          answer: 208
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
          answer: 208
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 381,
      question: {
        id: 56,
        question: 'An elevator pitch should last how long?',
        mcqchoice_set: [
          {
            id: 210,
            order: 0,
            choice_text: '10-15 seconds',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 211,
            order: 1,
            choice_text: '20-30 seconds',
            is_correct: true,
            explanation: 'Yup!'
          },
          {
            id: 212,
            order: 2,
            choice_text: '30-60 seconds',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 213,
            order: 3,
            choice_text: 'However long is necessary',
            is_correct: false,
            explanation: 'Nope!'
          }
        ]
      },
      mcqactivityuseranswer_set: [],
      activity_type: 'MCQActivity'
    },
    {
      id: 382,
      question: {
        id: 57,
        question: 'A pitch must be able to answer...',
        mcqchoice_set: [
          {
            id: 214,
            order: 0,
            choice_text: 'Who you’re helping',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 215,
            order: 1,
            choice_text: 'What problem you help with',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 216,
            order: 2,
            choice_text: 'How you solve that problem',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 217,
            order: 3,
            choice_text: 'What impact your solution has',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 218,
            order: 4,
            choice_text: 'All of the above ',
            is_correct: true,
            explanation: 'Correct'
          }
        ]
      },
      mcqactivityuseranswer_set: [],
      activity_type: 'MCQActivity'
    },
    {
      id: 383,
      length: 2.19814,
      activity_type: 'VideoActivity'
    },
    {
      id: 384,
      length: 6.768389,
      activity_type: 'PairGroupingActivity'
    },
    {
      id: 385,
      length: 2.002256,
      activity_type: 'VideoActivity'
    },
    {
      id: 386,
      length: 3.18858,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 387,
      length: 2.356988,
      activity_type: 'VideoActivity'
    },
    {
      id: 388,
      length: 6.456457,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 389,
      length: 4.09643,
      activity_type: 'VideoActivity'
    },
    {
      id: 390,
      length: 7.67513,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 391,
      length: 2.288743,
      activity_type: 'VideoActivity'
    },
    {
      instructions: 'Generate your pitches, brainstorm, pitch and then vote!',
      pitchomaticblank_set: [
        {
          id: 13,
          order: 0,
          label: 'You are pitching:',
          pitchomaticblankchoice_set: [
            {
              id: 89,
              value: 'Coca Cola'
            },
            {
              id: 90,
              value: 'SpaceX'
            },
            {
              id: 91,
              value: 'Tesla'
            },
            {
              id: 92,
              value: 'Disney'
            },
            {
              id: 93,
              value: 'Apple'
            },
            {
              id: 94,
              value: 'McDonalds'
            },
            {
              id: 95,
              value: 'Netflix'
            },
            {
              id: 96,
              value: 'WestJet'
            },
            {
              id: 97,
              value: 'IKEA'
            },
            {
              id: 98,
              value: 'Walmart'
            },
            {
              id: 99,
              value: 'Facebook'
            },
            {
              id: 100,
              value: 'NHL'
            }
          ]
        },
        {
          id: 14,
          order: 1,
          label: 'You are pitching to:',
          pitchomaticblankchoice_set: [
            {
              id: 101,
              value: 'a CTO'
            },
            {
              id: 102,
              value: 'a venture capitalist'
            },
            {
              id: 103,
              value: 'a 5 year old'
            },
            {
              id: 104,
              value: 'an 86 year old grandmother'
            },
            {
              id: 105,
              value: 'a group of college students'
            },
            {
              id: 106,
              value: 'academics at a conference'
            },
            {
              id: 107,
              value: 'an elevator full of random people'
            }
          ]
        },
        {
          id: 15,
          order: 2,
          label: 'And the technique you need to use is:',
          pitchomaticblankchoice_set: [
            {
              id: 108,
              value: 'a story'
            },
            {
              id: 109,
              value: 'a surprising fact'
            },
            {
              id: 110,
              value: 'an analogy'
            }
          ]
        }
      ],
      feedbackquestion_set: [
        {
          id: 64,
          question_type: 'rating_agreedisagree',
          question_text: 'The pitch was compelling',
          is_combo: false,
          combo_text: null
        },
        {
          id: 65,
          question_type: 'rating_agreedisagree',
          question_text: 'The pitch answered all the essential questions',
          is_combo: false,
          combo_text: null
        },
        {
          id: 66,
          question_type: 'rating_agreedisagree',
          question_text: 'Overall, the pitch was excellent',
          is_combo: true,
          combo_text: null
        }
      ],
      pitchomaticgroupmembers: [
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
          pitch_prep_text: null,
          pitch: {
            pitchomaticgroupmemberpitchchoice_set: [
              {
                pitchomaticblank: 13,
                choice: 90
              },
              {
                pitchomaticblank: 14,
                choice: 105
              },
              {
                pitchomaticblank: 15,
                choice: 110
              }
            ]
          },
          pitchomaticfeedback_set: [
            {
              user: 8,
              feedbackquestion: 64,
              rating_answer: 4,
              text_answer: '4'
            },
            {
              user: 8,
              feedbackquestion: 65,
              rating_answer: 5,
              text_answer: '5'
            },
            {
              user: 8,
              feedbackquestion: 66,
              rating_answer: 5,
              text_answer: '5'
            }
          ]
        },
        {
          user: {
            id: 7,
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
          pitch_prep_text: null,
          pitch: {
            pitchomaticgroupmemberpitchchoice_set: [
              {
                pitchomaticblank: 13,
                choice: 96
              },
              {
                pitchomaticblank: 14,
                choice: 105
              },
              {
                pitchomaticblank: 15,
                choice: 109
              }
            ]
          },
          pitchomaticfeedback_set: [
            {
              user: 2,
              feedbackquestion: 64,
              rating_answer: 5,
              text_answer: '5'
            },
            {
              user: 2,
              feedbackquestion: 65,
              rating_answer: 5,
              text_answer: '5'
            },
            {
              user: 2,
              feedbackquestion: 66,
              rating_answer: 3,
              text_answer: '3'
            }
          ]
        }
      ],
      activity_type: 'PitchoMaticActivity'
    },
    {
      id: 393,
      length: 8.633549,
      activity_type: 'VideoActivity'
    },
    {
      id: 394,
      feedbackquestion_set: [
        {
          id: 67,
          feedbackuseranswer_set: [],
          average_rating: null,
          question_type: 'rating_agreedisagree',
          question_text: 'I can evaluate the quality of a pitch.',
          is_combo: false,
          combo_text: 'Why is that?',
          feedbackactivity: 394,
          pitchomaticactivity: null
        },
        {
          id: 68,
          feedbackuseranswer_set: [],
          average_rating: null,
          question_type: 'rating_agreedisagree',
          question_text:
            'I can deliver a clear, concise, and compelling pitch.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 394,
          pitchomaticactivity: null
        },
        {
          id: 69,
          feedbackuseranswer_set: [],
          average_rating: null,
          question_type: 'rating_agreedisagree',
          question_text: 'I can adjust my pitch to fit different situations.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 394,
          pitchomaticactivity: null
        }
      ],
      titlecomponent: {
        title: 'What about now?',
        title_image: 'emoji://memo',
        screen_instructions: 'Fill out the form on your phone',
        participant_instructions:
          'How do you feel about your pitching skills now?'
      },
      activity_type: 'FeedbackActivity'
    },
    {
      id: 395,
      length: 1.909211,
      activity_type: 'VideoActivity'
    },
    {
      id: 397,
      feedbackquestion_set: [
        {
          id: 70,
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 70
            },
            {
              user: {
                id: 7,
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 70
            }
          ],
          average_rating: '4.50',
          question_type: 'rating_agreedisagree',
          question_text:
            'What I learned in this session will improve my skills.',
          is_combo: true,
          combo_text: 'Why is that?',
          feedbackactivity: 397,
          pitchomaticactivity: null
        },
        {
          id: 71,
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
              feedbackquestion: 71
            },
            {
              user: {
                id: 7,
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 71
            }
          ],
          average_rating: '5.00',
          question_type: 'rating_agreedisagree',
          question_text: 'I found this session fun',
          is_combo: true,
          combo_text: 'Why is that?',
          feedbackactivity: 397,
          pitchomaticactivity: null
        }
      ],
      titlecomponent: {
        title: 'Please leave some feedback for us!',
        title_image: 'emoji://memo',
        screen_instructions:
          'We\'d really appreciate your feedback. Submit on your phone- it’ll only take a minute!',
        participant_instructions: 'What did you think about today\'s lesson?'
      },
      activity_type: 'FeedbackActivity'
    }
  ]
};

const activityResult3 = {
  id: 3,
  start_time: '2019-10-24T09:22:22.302331-04:00',
  end_time: '2019-10-24T09:48:46.968523-04:00',
  lessonrun_code: 8269,
  joined_users: [
    {
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
    {
      id: 6,
      username: 'khana',
      first_name: 'Mahin',
      last_name: 'Khan',
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
    {
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
    {
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
    {
      id: 9,
      username: 'matt',
      first_name: 'Natasia',
      last_name: '',
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
    {
      id: 10,
      username: 'khana',
      first_name: 'Jhosh',
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
    {
      id: 11,
      username: 'patrick',
      first_name: 'Patrick',
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
    {
      id: 12,
      username: 'jhon',
      first_name: 'Jhon',
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
    }
  ],
  host: {
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
  activity_results: [
    {
      id: 74,
      length: 82.198334,
      activity_type: 'LobbyActivity'
    },
    {
      id: 51,
      length: 3.558171,
      activity_type: 'VideoActivity'
    },
    {
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
              rating_answer: 1,
              text_answer: '1',
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
              rating_answer: 3,
              text_answer: '3',
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 23
            },
            {
              user: {
                id: 9,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 23
            },
            {
              user: {
                id: 10,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 23
            },
            {
              user: {
                id: 11,
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 23
            },
            {
              user: {
                id: 12,
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 23
            }
          ],
          average_rating: '3.75',
          question_type: 'rating_agreedisagree',
          question_text: 'I can evaluate the quality of a pitch.',
          is_combo: false,
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
              rating_answer: 3,
              text_answer: '3',
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
              rating_answer: 2,
              text_answer: '2',
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 24
            },
            {
              user: {
                id: 9,
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 24
            },
            {
              user: {
                id: 10,
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
              rating_answer: 2,
              text_answer: '2',
              feedbackquestion: 24
            },
            {
              user: {
                id: 11,
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
                id: 12,
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
              rating_answer: 1,
              text_answer: '1',
              feedbackquestion: 24
            }
          ],
          average_rating: '3.75',
          question_type: 'rating_agreedisagree',
          question_text:
            'I can deliver a clear, concise, and compelling pitch.',
          is_combo: false,
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
              rating_answer: 3,
              text_answer: '3',
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
              rating_answer: 1,
              text_answer: '1',
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 25
            },
            {
              user: {
                id: 9,
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 25
            },
            {
              user: {
                id: 10,
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
              rating_answer: 3,
              text_answer: '3',
              feedbackquestion: 25
            },
            {
              user: {
                id: 11,
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
              rating_answer: 1,
              text_answer: '1',
              feedbackquestion: 25
            },
            {
              user: {
                id: 12,
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
              rating_answer: 1,
              text_answer: '1',
              feedbackquestion: 25
            }
          ],
          average_rating: '3.75',
          question_type: 'rating_agreedisagree',
          question_text: 'I can adjust my pitch to fit different situations.',
          is_combo: false,
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
    },
    {
      id: 53,
      length: 4.273128,
      activity_type: 'VideoActivity'
    },
    {
      winning_user: {
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
      buildapitchblank_set: [
        {
          id: 11,
          order: 0,
          label: ' At',
          temp_text: 'company name',
          help_text: ' What company are you pitching?'
        },
        {
          id: 12,
          order: 1,
          label: 'we help',
          temp_text: 'the audience',
          help_text:
            ' Who do you help? Try and be as specific as possible (e.g. demographics, industry, size)'
        },
        {
          id: 13,
          order: 2,
          label: 'with',
          temp_text: 'the problem',
          help_text:
            'What needs, challenges and frustrations do your customers have?'
        },
        {
          id: 14,
          order: 3,
          label: 'by',
          temp_text: 'the solution',
          help_text: 'How do you solve your target customer’s problem?'
        },
        {
          id: 15,
          order: 4,
          label: 'because',
          temp_text: 'the why',
          help_text: 'Why is this problem worth solving?'
        }
      ],
      pitch_summaries: [
        {
          user: 2,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'benji'
            },
            {
              buildapitchblank: 12,
              value: 'trainers'
            },
            {
              buildapitchblank: 13,
              value: 'training'
            },
            {
              buildapitchblank: 14,
              value: 'platform'
            },
            {
              buildapitchblank: 15,
              value: 'I like beer'
            }
          ],
          votes: 3
        },
        {
          user: 6,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'khasol'
            },
            {
              buildapitchblank: 12,
              value: 'web devs'
            },
            {
              buildapitchblank: 13,
              value: 'dev web'
            },
            {
              buildapitchblank: 14,
              value: 'programming'
            },
            {
              buildapitchblank: 15,
              value: 'I like money'
            }
          ],
          votes: 0
        },
        {
          user: 7,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'unknown company'
            },
            {
              buildapitchblank: 12,
              value: 'consult'
            },
            {
              buildapitchblank: 13,
              value: 'excel'
            },
            {
              buildapitchblank: 14,
              value: 'computers'
            },
            {
              buildapitchblank: 15,
              value: 'bacause I can'
            }
          ],
          votes: 1
        },
        {
          user: 8,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'companyx'
            },
            {
              buildapitchblank: 12,
              value: 'aaaa'
            },
            {
              buildapitchblank: 13,
              value: 'no problem'
            },
            {
              buildapitchblank: 14,
              value: 'no solution'
            },
            {
              buildapitchblank: 15,
              value: 'i like food'
            }
          ],
          votes: 0
        },
        {
          user: 9,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'companyx'
            },
            {
              buildapitchblank: 12,
              value: 'aaaa'
            },
            {
              buildapitchblank: 13,
              value: 'no problem'
            },
            {
              buildapitchblank: 14,
              value: 'no solution'
            },
            {
              buildapitchblank: 15,
              value: 'i like food'
            }
          ],
          votes: 0
        },
        {
          user: 10,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'companyx'
            },
            {
              buildapitchblank: 12,
              value: 'aaaa'
            },
            {
              buildapitchblank: 13,
              value: 'no problem'
            },
            {
              buildapitchblank: 14,
              value: 'no solution'
            },
            {
              buildapitchblank: 15,
              value: 'i like food'
            }
          ],
          votes: 0
        },
        {
          user: 11,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'companyx'
            },
            {
              buildapitchblank: 12,
              value: 'aaaa'
            },
            {
              buildapitchblank: 13,
              value: 'no problem'
            },
            {
              buildapitchblank: 14,
              value: 'no solution'
            },
            {
              buildapitchblank: 15,
              value: 'i like food'
            }
          ],
          votes: 0
        },
        {
          user: 12,
          buildapitchentry_set: [
            {
              buildapitchblank: 11,
              value: 'companyx'
            },
            {
              buildapitchblank: 12,
              value: 'aaaa'
            },
            {
              buildapitchblank: 13,
              value: 'no problem'
            },
            {
              buildapitchblank: 14,
              value: 'no solution'
            },
            {
              buildapitchblank: 15,
              value: 'i like food'
            }
          ],
          votes: 0
        }
      ],
      activity_type: 'BuildAPitchActivity'
    },
    {
      id: 55,
      length: 69.582211,
      activity_type: 'VideoActivity'
    },
    {
      id: 56,
      question: {
        id: 11,
        question: 'What are the three C\'s of a good pitch?',
        mcqchoice_set: [
          {
            id: 37,
            order: 0,
            choice_text: 'Clear, compelling, concise',
            is_correct: true,
            explanation: 'Correct!'
          },
          {
            id: 38,
            order: 1,
            choice_text: 'Clear, catchy, concise',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 39,
            order: 2,
            choice_text: 'Compelling, charismatic, clear',
            is_correct: false,
            explanation: 'Nope!'
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
          answer: 38
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
          answer: 39
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
          answer: 39
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
          answer: 37
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 57,
      question: {
        id: 12,
        question: 'How can you make your pitch more memorable?',
        mcqchoice_set: [
          {
            id: 40,
            order: 0,
            choice_text: 'Make it relatable',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 41,
            order: 1,
            choice_text: 'Make it surprising',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 42,
            order: 2,
            choice_text: 'Make it short',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 43,
            order: 3,
            choice_text: 'All of the above',
            is_correct: true,
            explanation: 'Correct!'
          }
        ]
      },
      mcqactivityuseranswer_set: [
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
          answer: 43
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
          answer: 43
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
          answer: 43
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
          answer: 43
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 58,
      question: {
        id: 13,
        question: 'True or false: an elevator pitch is a sales pitch.',
        mcqchoice_set: [
          {
            id: 44,
            order: 0,
            choice_text: 'True',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 45,
            order: 1,
            choice_text: 'False',
            is_correct: true,
            explanation: 'Correct'
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
          answer: 45
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
          answer: 45
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
          answer: 45
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
          answer: 45
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 59,
      question: {
        id: 14,
        question: 'An elevator pitch should last how long?',
        mcqchoice_set: [
          {
            id: 46,
            order: 0,
            choice_text: '10-15 seconds',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 47,
            order: 1,
            choice_text: '20-30 seconds',
            is_correct: true,
            explanation: 'Yup!'
          },
          {
            id: 48,
            order: 2,
            choice_text: '30-60 seconds',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 49,
            order: 3,
            choice_text: 'However long is necessary',
            is_correct: false,
            explanation: 'Nope!'
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
          answer: 46
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
          answer: 46
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
          answer: 46
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
          answer: 46
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 60,
      question: {
        id: 15,
        question: 'A pitch must be able to answer...',
        mcqchoice_set: [
          {
            id: 50,
            order: 0,
            choice_text: 'Who you’re helping',
            is_correct: false,
            explanation: 'Incorrect'
          },
          {
            id: 51,
            order: 1,
            choice_text: 'What problem you help with',
            is_correct: false,
            explanation: 'Not quite!'
          },
          {
            id: 52,
            order: 2,
            choice_text: 'How you solve that problem',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 53,
            order: 3,
            choice_text: 'What impact your solution has',
            is_correct: false,
            explanation: 'Nope!'
          },
          {
            id: 54,
            order: 4,
            choice_text: 'All of the above ',
            is_correct: true,
            explanation: 'Correct'
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
          answer: 54
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
          answer: 54
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
          answer: 52
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
          answer: 52
        }
      ],
      activity_type: 'MCQActivity'
    },
    {
      id: 61,
      length: 5.608571,
      activity_type: 'VideoActivity'
    },
    {
      id: 62,
      length: 4.456338,
      activity_type: 'PairGroupingActivity'
    },
    {
      id: 63,
      length: 1.925616,
      activity_type: 'VideoActivity'
    },
    {
      id: 64,
      length: 3.026629,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 65,
      length: 2.15773,
      activity_type: 'VideoActivity'
    },
    {
      id: 66,
      length: 2.30101,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 67,
      length: 2.025464,
      activity_type: 'VideoActivity'
    },
    {
      id: 68,
      length: 2.75274,
      activity_type: 'DiscussionActivity'
    },
    {
      id: 69,
      length: 2.222198,
      activity_type: 'VideoActivity'
    },
    {
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
          pitch_prep_text:
            'my notes are my notes and nobody else should see them',
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
              text_answer: '1'
            },
            {
              user: 6,
              feedbackquestion: 28,
              rating_answer: 1,
              text_answer: '1'
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
    },
    {
      id: 71,
      length: 4.372423,
      activity_type: 'VideoActivity'
    },
    {
      id: 72,
      feedbackquestion_set: [
        {
          id: 29,
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
              feedbackquestion: 29
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
              feedbackquestion: 29
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 29
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
              feedbackquestion: 29
            },
            {
              user: {
                id: 9,
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
              feedbackquestion: 29
            },
            {
              user: {
                id: 10,
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 29
            },
            {
              user: {
                id: 11,
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 29
            },
            {
              user: {
                id: 12,
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 29
            }
          ],
          average_rating: '4.50',
          question_type: 'rating_agreedisagree',
          question_text: 'I can evaluate the quality of a pitch.',
          is_combo: false,
          combo_text: 'Why is that?',
          feedbackactivity: 72,
          pitchomaticactivity: null
        },
        {
          id: 30,
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
              feedbackquestion: 30
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 30
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 30
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 30
            },
            {
              user: {
                id: 9,
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
              feedbackquestion: 30
            },
            {
              user: {
                id: 10,
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 30
            },
            {
              user: {
                id: 11,
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
              rating_answer: 4,
              text_answer: '4',
              feedbackquestion: 30
            },
            {
              user: {
                id: 12,
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
              feedbackquestion: 30
            }
          ],
          average_rating: '4.75',
          question_type: 'rating_agreedisagree',
          question_text:
            'I can deliver a clear, concise, and compelling pitch.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 72,
          pitchomaticactivity: null
        },
        {
          id: 31,
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
              feedbackquestion: 31
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
              feedbackquestion: 31
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 31
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 31
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 31
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
              feedbackquestion: 31
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 31
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
              rating_answer: 5,
              text_answer: '5',
              feedbackquestion: 31
            }
          ],
          average_rating: '4.75',
          question_type: 'rating_agreedisagree',
          question_text: 'I can adjust my pitch to fit different situations.',
          is_combo: false,
          combo_text: null,
          feedbackactivity: 72,
          pitchomaticactivity: null
        }
      ],
      titlecomponent: {
        title: 'What about now?',
        title_image: 'emoji://memo',
        screen_instructions: 'Fill out the form on your phone',
        participant_instructions:
          'How do you feel about your pitching skills now?'
      },
      activity_type: 'FeedbackActivity'
    },
    {
      id: 73,
      length: 35.13645,
      activity_type: 'VideoActivity'
    },
    {
      id: 75,
      feedbackquestion_set: [
        {
          id: 32,
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
              text_answer: 'I learned a lot in this session.',
              feedbackquestion: 32
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
              text_answer: 'I found it interesting to improve my skills.',
              feedbackquestion: 32
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
              rating_answer: 4,
              text_answer: 'I like it.',
              feedbackquestion: 32
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
              rating_answer: 5,
              text_answer: 'This session definitely taught me a lot.',
              feedbackquestion: 32
            },
            {
              user: {
                id: 9,
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
              rating_answer: 5,
              text_answer: 'This session definitely taught me a lot.',
              feedbackquestion: 32
            }
          ],
          average_rating: '4.50',
          question_type: 'rating_agreedisagree',
          question_text:
            'What I learned in this session will improve my skills.',
          is_combo: true,
          combo_text: 'Why is that?',
          feedbackactivity: 75,
          pitchomaticactivity: null
        },
        {
          id: 33,
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
              text_answer: 'It was a lot of fun.',
              feedbackquestion: 33
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
              rating_answer: 5,
              text_answer: 'I loved it. Cant wait to do it again.',
              feedbackquestion: 33
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
              rating_answer: 4,
              text_answer:
                'The games and interactivity is much better than normal training.',
              feedbackquestion: 33
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
              text_answer: 'Its easy to signup and start training in 2 mins.',
              feedbackquestion: 33
            }
          ],
          average_rating: '4.50',
          question_type: 'rating_agreedisagree',
          question_text: 'I found this session fun',
          is_combo: true,
          combo_text: 'Why is that?',
          feedbackactivity: 75,
          pitchomaticactivity: null
        }
      ],
      titlecomponent: {
        title: 'Please leave some feedback for us!',
        title_image: 'emoji://memo',
        screen_instructions:
          'We\'d really appreciate your feedback. Submit on your phone- it’ll only take a minute!',
        participant_instructions: 'What did you think about today\'s lesson?'
      },
      activity_type: 'FeedbackActivity'
    }
  ]
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/*

this.data = {
  updatemessage: {
    lesson: {
      id: 2,
      lesson_id: 'testing_1',
      lesson_name: 'Testing Lesson',
      lesson_length_minutes: 45,
      lesson_description: 'Use this lesson to test activities',
      course: 2,
      next_lesson: null
    },
    lesson_run: {
      id: 14,
      start_time: '2019-05-14T17:34:24.071182-04:00',
      end_time: null,
      lessonrun_code: 49692,
      joined_users: [
        {
          id: 3,
          username: 'mahin',
          first_name: 'Mahin',
          last_name: 'Khan',
          email: 'mahin@mybenji.com',
          verified_email: false,
          job_title: 'Front End Developer',
          organization_name: 'Benji',
          orggroup_name: 'Developers',
          local_admin_permission: true,
          participant_permission: true
        },
        {
          id: 6,
          username: 'khan',
          first_name: 'khan',
          last_name: '',
          email: '',
          verified_email: false,
          job_title: null,
          organization_name: null,
          orggroup_name: null,
          local_admin_permission: false,
          participant_permission: true
        }
      ]
    },
    base_activity: {
      activity_id: 'pom_test',
      description: 'PitchoMatic',
      start_time: '2019-05-14T17:34:41.175945-04:00',
      end_time: null,
      is_paused: false,
      next_activity_delay_seconds: 15,
      next_activity_start_timer: {
        id: 190,
        status: 'running',
        start_time: '2019-05-14T17:35:04.144093-04:00',
        end_time: '2019-05-14 21:35:19.144093+00:00',
        total_seconds: 15,
        remaining_seconds: 14.747642
      }
    },
    activity_type: 'PitchoMaticActivity',
    pitchomaticactivity: {
      instructions: 'Test Instructions',
      activity_status: 'pitching',
      prepare_timer: {
        id: 173,
        status: 'cancelled',
        start_time: '2019-05-14T17:34:41.202339-04:00',
        end_time: null,
        total_seconds: 15,
        remaining_seconds: 0
      },
      group_timer: null,
      pitch_timer: {
        id: 175,
        status: 'running',
        start_time: '2019-05-14T17:34:57.291984-04:00',
        end_time: '2019-05-14 21:35:32.291984+00:00',
        total_seconds: 35,
        remaining_seconds: 27.894537
      },
      feedback_timer: null,
      pitchomaticblank_set: [
        {
          id: 40,
          order: 0,
          label: 'The company you are pitching is:',
          pitchomaticblankchoice_set: [
            {
              id: 170,
              value: 'Netflix'
            },
            {
              id: 171,
              value: 'Google'
            },
            {
              id: 172,
              value: 'Uber'
            },
            {
              id: 173,
              value: 'Exxon'
            },
            {
              id: 174,
              value: 'Apple'
            },
            {
              id: 175,
              value: 'Ikea'
            }
          ]
        },
        {
          id: 41,
          order: 1,
          label: 'You are pitching to:',
          pitchomaticblankchoice_set: [
            {
              id: 176,
              value: 'dwarves'
            },
            {
              id: 177,
              value: 'elves'
            },
            {
              id: 178,
              value: 'orcs'
            },
            {
              id: 179,
              value: 'your mom'
            }
          ]
        },
        {
          id: 42,
          order: 2,
          label: 'And the technique you need to use is:',
          pitchomaticblankchoice_set: [
            {
              id: 180,
              value: 'hypnosis'
            },
            {
              id: 181,
              value: 'jedi mind-trick'
            },
            {
              id: 182,
              value: 'analogy'
            }
          ]
        }
      ],
      pitchomaticgroup_set: [
        {
          group_emoji: 'emoji://banana',
          pitchomaticgroupmember_set: [
            {
              user: {
                id: 6,
                username: 'khan',
                first_name: 'khan',
                last_name: '',
                email: '',
                verified_email: false,
                job_title: null,
                organization_name: null,
                orggroup_name: null,
                local_admin_permission: false,
                participant_permission: true
              },
              is_grouped: false,
              has_generated: false,
              has_prepared: true,
              is_pitching: false,
              pitch_done: true,
              pitch_prep_text:
                'sdfsdfsdfsds dfasdfsds dsdfasdfasdfasdfa sdfsdfsdsds dseeeeeddggg ddddddddddd ddd',
              pitch: {
                pitchomaticgroupmemberpitchchoice_set: [
                  {
                    pitchomaticblank: 40,
                    choice: 170
                  },
                  {
                    pitchomaticblank: 41,
                    choice: 177
                  },
                  {
                    pitchomaticblank: 42,
                    choice: 180
                  }
                ]
              },
              pitch_status: 'done'
            },
            {
              user: {
                id: 3,
                username: 'mahin',
                first_name: 'Mahin',
                last_name: 'Khan',
                email: 'mahin@mybenji.com',
                verified_email: false,
                job_title: 'Front End Developer',
                organization_name: 'Benji',
                orggroup_name: 'Developers',
                local_admin_permission: true,
                participant_permission: true
              },
              is_grouped: false,
              has_generated: false,
              has_prepared: true,
              is_pitching: false,
              pitch_done: true,
              pitch_prep_text:
                'sdfsdfsdfsds dfasdfsds dsdfasdfasdfasdfa sdfsdfsdsds dseeeeeddggg ddddddddddd ddd',
              pitch: {
                pitchomaticgroupmemberpitchchoice_set: [
                  {
                    pitchomaticblank: 40,
                    choice: 171
                  },
                  {
                    pitchomaticblank: 41,
                    choice: 177
                  },
                  {
                    pitchomaticblank: 42,
                    choice: 180
                  }
                ]
              },
              pitch_status: 'done'
            }
          ]
        }
      ],
      feedbackquestion_set: [
        {
          id: 27,
          question_type: 'rating_agreedisagree',
          question_text: 'The pitch was concise',
          is_combo: false,
          combo_text: null
        },
        {
          id: 28,
          question_type: 'rating_agreedisagree',
          question_text: 'The delivery was strong and confident',
          is_combo: false,
          combo_text: null
        }
      ],
      activity_type: 'PitchoMaticActivity'
    }
  }
};
 */

//
//
//
//
//
//
//
//
//
//
//
//
//

//
//
//  Data for showing assessments
//
//
// this.data = {
//   id: 18,
//   start_time: '2019-09-13T16:12:39.557183-04:00',
//   end_time: '2019-09-13T16:29:30.493122-04:00',
//   lessonrun_code: 21484,
//   assessments: [
//     {
//       id: 526,
//       feedbackquestion_set: [
//         {
//           id: 89,
//           feedbackuseranswer_set: [
//             {
//               user: {
//                 id: 2,
//                 username: 'matt',
//                 first_name: 'Matt',
//                 last_name: 'Parson',
//                 email: 'matt@mybenji.com',
//                 verified_email: false,
//                 job_title: 'CEO',
//                 organization_name: 'Benji',
//                 orggroup_name: 'Sales',
//                 organization: 1,
//                 orggroup: 1,
//                 local_admin_permission: true,
//                 participant_permission: true
//               },
//               rating_answer: 5,
//               text_answer: '5',
//               feedbackquestion: 89
//             },
//             {
//               user: {
//                 id: 8,
//                 username: 'khan',
//                 first_name: 'khan',
//                 last_name: '',
//                 email: '',
//                 verified_email: false,
//                 job_title: null,
//                 organization_name: null,
//                 orggroup_name: null,
//                 organization: null,
//                 orggroup: null,
//                 local_admin_permission: false,
//                 participant_permission: true
//               },
//               rating_answer: 5,
//               text_answer: '5',
//               feedbackquestion: 89
//             }
//           ],
//           average_rating: '5.00',
//           question_type: 'rating_agreedisagree',
//           question_text: 'I can evaluate the quality of a pitch.',
//           is_combo: false,
//           combo_text: 'Why is that?',
//           feedbackactivity: 526,
//           pitchomaticactivity: null
//         },
//         {
//           id: 90,
//           feedbackuseranswer_set: [
//             {
//               user: {
//                 id: 2,
//                 username: 'matt',
//                 first_name: 'Matt',
//                 last_name: 'Parson',
//                 email: 'matt@mybenji.com',
//                 verified_email: false,
//                 job_title: 'CEO',
//                 organization_name: 'Benji',
//                 orggroup_name: 'Sales',
//                 organization: 1,
//                 orggroup: 1,
//                 local_admin_permission: true,
//                 participant_permission: true
//               },
//               rating_answer: 5,
//               text_answer: '5',
//               feedbackquestion: 90
//             },
//             {
//               user: {
//                 id: 8,
//                 username: 'khan',
//                 first_name: 'khan',
//                 last_name: '',
//                 email: '',
//                 verified_email: false,
//                 job_title: null,
//                 organization_name: null,
//                 orggroup_name: null,
//                 organization: null,
//                 orggroup: null,
//                 local_admin_permission: false,
//                 participant_permission: true
//               },
//               rating_answer: 5,
//               text_answer: '5',
//               feedbackquestion: 90
//             }
//           ],
//           average_rating: '5.00',
//           question_type: 'rating_agreedisagree',
//           question_text:
//             'I can deliver a clear, concise, and compelling pitch.',
//           is_combo: false,
//           combo_text: null,
//           feedbackactivity: 526,
//           pitchomaticactivity: null
//         },
//         {
//           id: 91,
//           feedbackuseranswer_set: [
//             {
//               user: {
//                 id: 2,
//                 username: 'matt',
//                 first_name: 'Matt',
//                 last_name: 'Parson',
//                 email: 'matt@mybenji.com',
//                 verified_email: false,
//                 job_title: 'CEO',
//                 organization_name: 'Benji',
//                 orggroup_name: 'Sales',
//                 organization: 1,
//                 orggroup: 1,
//                 local_admin_permission: true,
//                 participant_permission: true
//               },
//               rating_answer: 5,
//               text_answer: '5',
//               feedbackquestion: 91
//             },
//             {
//               user: {
//                 id: 8,
//                 username: 'khan',
//                 first_name: 'khan',
//                 last_name: '',
//                 email: '',
//                 verified_email: false,
//                 job_title: null,
//                 organization_name: null,
//                 orggroup_name: null,
//                 organization: null,
//                 orggroup: null,
//                 local_admin_permission: false,
//                 participant_permission: true
//               },
//               rating_answer: 5,
//               text_answer: '5',
//               feedbackquestion: 91
//             }
//           ],
//           average_rating: '5.00',
//           question_type: 'rating_agreedisagree',
//           question_text:
//             'I can adjust my pitch to fit different situations.',
//           is_combo: false,
//           combo_text: null,
//           feedbackactivity: 526,
//           pitchomaticactivity: null
//         }
//       ],
//       titlecomponent: {
//         title: 'What about now?',
//         title_image: 'emoji://memo',
//         screen_instructions: 'Fill out the form on your phone',
//         participant_instructions:
//           'How do you feel about your pitching skills now?'
//       },
//       activity_type: 'FeedbackActivity'
//     },
//     {
//       id: 506,
//       feedbackquestion_set: [
//         {
//           id: 83,
//           feedbackuseranswer_set: [
//             {
//               user: {
//                 id: 2,
//                 username: 'matt',
//                 first_name: 'Matt',
//                 last_name: 'Parson',
//                 email: 'matt@mybenji.com',
//                 verified_email: false,
//                 job_title: 'CEO',
//                 organization_name: 'Benji',
//                 orggroup_name: 'Sales',
//                 organization: 1,
//                 orggroup: 1,
//                 local_admin_permission: true,
//                 participant_permission: true
//               },
//               rating_answer: 2,
//               text_answer: '2',
//               feedbackquestion: 83
//             },
//             {
//               user: {
//                 id: 8,
//                 username: 'khan',
//                 first_name: 'khan',
//                 last_name: '',
//                 email: '',
//                 verified_email: false,
//                 job_title: null,
//                 organization_name: null,
//                 orggroup_name: null,
//                 organization: null,
//                 orggroup: null,
//                 local_admin_permission: false,
//                 participant_permission: true
//               },
//               rating_answer: 4,
//               text_answer: '4',
//               feedbackquestion: 83
//             }
//           ],
//           average_rating: '3.00',
//           question_type: 'rating_agreedisagree',
//           question_text: 'I can evaluate the quality of a pitch.',
//           is_combo: false,
//           combo_text: 'Why is that?',
//           feedbackactivity: 506,
//           pitchomaticactivity: null
//         },
//         {
//           id: 84,
//           feedbackuseranswer_set: [
//             {
//               user: {
//                 id: 2,
//                 username: 'matt',
//                 first_name: 'Matt',
//                 last_name: 'Parson',
//                 email: 'matt@mybenji.com',
//                 verified_email: false,
//                 job_title: 'CEO',
//                 organization_name: 'Benji',
//                 orggroup_name: 'Sales',
//                 organization: 1,
//                 orggroup: 1,
//                 local_admin_permission: true,
//                 participant_permission: true
//               },
//               rating_answer: 2,
//               text_answer: '2',
//               feedbackquestion: 84
//             },
//             {
//               user: {
//                 id: 8,
//                 username: 'khan',
//                 first_name: 'khan',
//                 last_name: '',
//                 email: '',
//                 verified_email: false,
//                 job_title: null,
//                 organization_name: null,
//                 orggroup_name: null,
//                 organization: null,
//                 orggroup: null,
//                 local_admin_permission: false,
//                 participant_permission: true
//               },
//               rating_answer: 5,
//               text_answer: '5',
//               feedbackquestion: 84
//             }
//           ],
//           average_rating: '3.50',
//           question_type: 'rating_agreedisagree',
//           question_text:
//             'I can deliver a clear, concise, and compelling pitch.',
//           is_combo: false,
//           combo_text: null,
//           feedbackactivity: 506,
//           pitchomaticactivity: null
//         },
//         {
//           id: 85,
//           feedbackuseranswer_set: [
//             {
//               user: {
//                 id: 2,
//                 username: 'matt',
//                 first_name: 'Matt',
//                 last_name: 'Parson',
//                 email: 'matt@mybenji.com',
//                 verified_email: false,
//                 job_title: 'CEO',
//                 organization_name: 'Benji',
//                 orggroup_name: 'Sales',
//                 organization: 1,
//                 orggroup: 1,
//                 local_admin_permission: true,
//                 participant_permission: true
//               },
//               rating_answer: 2,
//               text_answer: '2',
//               feedbackquestion: 85
//             },
//             {
//               user: {
//                 id: 8,
//                 username: 'khan',
//                 first_name: 'khan',
//                 last_name: '',
//                 email: '',
//                 verified_email: false,
//                 job_title: null,
//                 organization_name: null,
//                 orggroup_name: null,
//                 organization: null,
//                 orggroup: null,
//                 local_admin_permission: false,
//                 participant_permission: true
//               },
//               rating_answer: 4,
//               text_answer: '4',
//               feedbackquestion: 85
//             }
//           ],
//           average_rating: '3.00',
//           question_type: 'rating_agreedisagree',
//           question_text:
//             'I can adjust my pitch to fit different situations.',
//           is_combo: false,
//           combo_text: null,
//           feedbackactivity: 506,
//           pitchomaticactivity: null
//         }
//       ],
//       titlecomponent: {
//         title: 'Before we begin',
//         title_image: 'emoji://memo',
//         screen_instructions: 'Fill out the form on your phone',
//         participant_instructions:
//           'How do you feel about your pitching skills now?'
//       },
//       activity_type: 'FeedbackActivity'
//     }
//   ]
// };
