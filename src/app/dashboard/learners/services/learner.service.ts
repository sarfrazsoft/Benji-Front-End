import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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
export class LearnerService {
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  // getAdminPanelMetrics(): Observable<any> {
  //   return this.http.get(global.apiRoot + '/rest-auth/user/').pipe(
  //     map((res: Response) => {
  //       return { learners: 106, groups: 14, sessions: 18 };
  //     }),
  //     catchError(err => of(err.error))
  //   );
  // }

  getUsers(): Observable<any> {
    return this.http.get(global.apiRoot + '/tenants/users/').pipe(
      map(res => {
        return res;
      })
    );
  }

  getLearners(sort: string, order: string, page: number): Observable<User> {
    // django expects page index starting from 1
    const request = global.apiRoot + '/tenants/users/?page=' + (page + 1);
    return this.http.get<User>(request);
  }

  addLearners(emails) {
    const request = global.apiRoot + '/tenants/org_invites/';
    return this.http.post(request, emails);
  }

  getUserDetails(id) {
    const request = global.apiRoot + '/tenants/users/?id=' + id;
    return this.http.get<User>(request);
  }

  getOrganization() {
    const request = global.apiRoot + '/tenants/orgs/?page=' + 1;
    return this.http.get(request);
  }

  // getCourses(): Observable<any> {
  //   return this.http.get(global.apiRoot + '/course_details/course/').pipe(
  //     map(res => {
  //       return res;
  //     })
  //   );
  // }

  // api/course_details/lesson_run/{room_code}/summary/
  getReports(id: string): Observable<any> {
    return this.http
      .get(global.apiRoot + '/course_details/lesson_run/' + id + '/summary')
      .pipe(
        map((res: SessionReport) => {
          // this.data = activityResult3;
          res = activityResult3 as SessionReport;
          const arr: Array<ActivityReport> = [];

          arr.push(res);

          let pomActivity;

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
              pomActivity = {
                ...res,
                activity_type: ActivityTypes.pitchoMatic,
                pom: act as PitchOMaticReport
              };
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
          return pomActivity;
        })
      );
  }

  getPastSessions(sort: string, order: string, page: number): Observable<any> {
    return this.http.get(global.apiRoot + '/course_details/lesson_run/').pipe(
      map(res => {
        console.log(res);
        return res;
      })
    );
  }
}

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
              text_answer: '5',
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
              text_answer: '4',
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
              text_answer: '4',
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
              text_answer: '5',
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
              text_answer: '5',
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
              text_answer: '5',
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
              text_answer: '4',
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
              text_answer: '4',
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
