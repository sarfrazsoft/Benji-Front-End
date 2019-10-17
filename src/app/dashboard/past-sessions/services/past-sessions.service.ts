import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { User } from 'src/app/services/backend/schema';
import { feedback } from './feedback';
import { mcqsData } from './mcqs';
import { pom } from './pom';
import { assessmentsData } from './rankingquestions';

@Injectable()
export class PastSessionsService {
  data: any;
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {}

  // api/course_details/lesson_run/{room_code}/summary/
  getReports(id: string): Observable<any> {
    return this.http
      .get(global.apiRoot + '/course_details/lesson_run/' + id + '/summary')
      .pipe(
        map(res => {
          // this.data = mcqsData;
          // this.data = feedback;
          this.data = pom;
          // this.data = assessmentsData;
          // this.data = {
          //   id: 18,
          //   start_time: '2019-09-13T16:12:39.557183-04:00',
          //   end_time: '2019-09-13T16:29:30.493122-04:00',
          //   lessonrun_code: 21484,
          //   joined_users: [{}, {}, {}, {}, {}]
          // };
          return this.data;
        })
      );
  }

  getLearners(sort: string, order: string, page: number): Observable<User> {
    // django expects page index starting from 1
    const request = global.apiRoot + '/tenants/users/?page=' + (page + 1);
    return this.http.get<User>(request);
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

// this.data = {
//   id: 18,
//   start_time: '2019-09-13T16:12:39.557183-04:00',
//   end_time: '2019-09-13T16:29:30.493122-04:00',
//   lessonrun_code: 21484,
//   joined_users: [
//     {
//       id: 2,
//       username: 'matt',
//       first_name: 'Matt',
//       last_name: 'Parson',
//       email: 'matt@mybenji.com',
//       verified_email: false,
//       job_title: 'CEO',
//       organization_name: 'Benji',
//       orggroup_name: 'Sales',
//       organization: 1,
//       orggroup: 1,
//       local_admin_permission: true,
//       participant_permission: true
//     },
//     {
//       id: 8,
//       username: 'khan',
//       first_name: 'khan',
//       last_name: '',
//       email: '',
//       verified_email: false,
//       job_title: null,
//       organization_name: null,
//       orggroup_name: null,
//       organization: null,
//       orggroup: null,
//       local_admin_permission: false,
//       participant_permission: true
//     }
//   ],
//   host: {
//     id: 2,
//     username: 'matt',
//     first_name: 'Matt',
//     last_name: 'Parson',
//     email: 'matt@mybenji.com',
//     verified_email: false,
//     job_title: 'CEO',
//     organization_name: 'Benji',
//     orggroup_name: 'Sales',
//     organization: 1,
//     orggroup: 1,
//     local_admin_permission: true,
//     participant_permission: true
//   },
// activity_results: [
//   {
//     id: 529,
//     feedbackquestion_set: [
//       {
//         id: 92,
//         feedbackuseranswer_set: [
//           {
//             user: {
//               id: 2,
//               username: 'matt',
//               first_name: 'Matt',
//               last_name: 'Parson',
//               email: 'matt@mybenji.com',
//               verified_email: false,
//               job_title: 'CEO',
//               organization_name: 'Benji',
//               orggroup_name: 'Sales',
//               organization: 1,
//               orggroup: 1,
//               local_admin_permission: true,
//               participant_permission: true
//             },
//             rating_answer: 3,
//             text_answer: '3',
//             feedbackquestion: 92
//           },
//           {
//             user: {
//               id: 8,
//               username: 'khan',
//               first_name: 'khan',
//               last_name: '',
//               email: '',
//               verified_email: false,
//               job_title: null,
//               organization_name: null,
//               orggroup_name: null,
//               organization: null,
//               orggroup: null,
//               local_admin_permission: false,
//               participant_permission: true
//             },
//             rating_answer: 4,
//             text_answer: '4',
//             feedbackquestion: 92
//           }
//         ],
//         average_rating: '3.50',
//         question_type: 'rating_agreedisagree',
//         question_text:
//           'What I learned in this session will improve my skills.',
//         is_combo: true,
//         combo_text: 'Why is that?',
//         feedbackactivity: 529,
//         pitchomaticactivity: null
//       },
//       {
//         id: 93,
//         feedbackuseranswer_set: [
//           {
//             user: {
//               id: 2,
//               username: 'matt',
//               first_name: 'Matt',
//               last_name: 'Parson',
//               email: 'matt@mybenji.com',
//               verified_email: false,
//               job_title: 'CEO',
//               organization_name: 'Benji',
//               orggroup_name: 'Sales',
//               organization: 1,
//               orggroup: 1,
//               local_admin_permission: true,
//               participant_permission: true
//             },
//             rating_answer: 5,
//             text_answer: '5',
//             feedbackquestion: 93
//           },
//           {
//             user: {
//               id: 8,
//               username: 'khan',
//               first_name: 'khan',
//               last_name: '',
//               email: '',
//               verified_email: false,
//               job_title: null,
//               organization_name: null,
//               orggroup_name: null,
//               organization: null,
//               orggroup: null,
//               local_admin_permission: false,
//               participant_permission: true
//             },
//             rating_answer: 5,
//             text_answer: '5',
//             feedbackquestion: 93
//           }
//         ],
//         average_rating: '5.00',
//         question_type: 'rating_agreedisagree',
//         question_text: 'I found this session fun',
//         is_combo: true,
//         combo_text: null,
//         feedbackactivity: 529,
//         pitchomaticactivity: null
//       }
//     ],
//     titlecomponent: {
//       title: 'Please leave some feedback for us!',
//       title_image: 'emoji://memo',
//       screen_instructions:
//         'We\'d really appreciate your feedback. Submit on your phone- it’ll only take a minute!',
//       participant_instructions:
//         'What did you think about today\'s lesson?'
//     },
//     activity_type: 'FeedbackActivity'
//   },
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
// {
//   id: 514,
//   question: {
//     id: 74,
//     question: 'A pitch must be able to answer...',
//     mcqchoice_set: [
//       {
//         id: 284,
//         order: 4,
//         choice_text: 'All of the above ',
//         is_correct: true,
//         explanation: 'Correct'
//       },
//       {
//         id: 283,
//         order: 3,
//         choice_text: 'What impact your solution has',
//         is_correct: false,
//         explanation: 'Nope!'
//       },
//       {
//         id: 282,
//         order: 2,
//         choice_text: 'How you solve that problem',
//         is_correct: false,
//         explanation: 'Nope!'
//       },
//       {
//         id: 281,
//         order: 1,
//         choice_text: 'What problem you help with',
//         is_correct: false,
//         explanation: 'Not quite!'
//       },
//       {
//         id: 280,
//         order: 0,
//         choice_text: 'Who you’re helping',
//         is_correct: false,
//         explanation: 'Incorrect'
//       }
//     ]
//   },
//   mcqactivityuseranswer_set: [
//     {
//       user: {
//         id: 2,
//         username: 'matt',
//         first_name: 'Matt',
//         last_name: 'Parson',
//         email: 'matt@mybenji.com',
//         verified_email: false,
//         job_title: 'CEO',
//         organization_name: 'Benji',
//         orggroup_name: 'Sales',
//         organization: 1,
//         orggroup: 1,
//         local_admin_permission: true,
//         participant_permission: true
//       },
//       answer: 284
//     },
//     {
//       user: {
//         id: 8,
//         username: 'khan',
//         first_name: 'khan',
//         last_name: '',
//         email: '',
//         verified_email: false,
//         job_title: null,
//         organization_name: null,
//         orggroup_name: null,
//         organization: null,
//         orggroup: null,
//         local_admin_permission: false,
//         participant_permission: true
//       },
//       answer: 283
//     }
//   ],
//   activity_type: 'MCQActivity'
// },
// {
//   id: 513,
//   question: {
//     id: 73,
//     question: 'An elevator pitch should last how long?',
//     mcqchoice_set: [
//       {
//         id: 279,
//         order: 3,
//         choice_text: 'However long is necessary',
//         is_correct: false,
//         explanation: 'Nope!'
//       },
//       {
//         id: 278,
//         order: 2,
//         choice_text: '30-60 seconds',
//         is_correct: false,
//         explanation: 'Nope!'
//       },
//       {
//         id: 277,
//         order: 1,
//         choice_text: '20-30 seconds',
//         is_correct: true,
//         explanation: 'Yup!'
//       },
//       {
//         id: 276,
//         order: 0,
//         choice_text: '10-15 seconds',
//         is_correct: false,
//         explanation: 'Incorrect'
//       }
//     ]
//   },
//   mcqactivityuseranswer_set: [
//     {
//       user: {
//         id: 2,
//         username: 'matt',
//         first_name: 'Matt',
//         last_name: 'Parson',
//         email: 'matt@mybenji.com',
//         verified_email: false,
//         job_title: 'CEO',
//         organization_name: 'Benji',
//         orggroup_name: 'Sales',
//         organization: 1,
//         orggroup: 1,
//         local_admin_permission: true,
//         participant_permission: true
//       },
//       answer: 277
//     },
//     {
//       user: {
//         id: 8,
//         username: 'khan',
//         first_name: 'khan',
//         last_name: '',
//         email: '',
//         verified_email: false,
//         job_title: null,
//         organization_name: null,
//         orggroup_name: null,
//         organization: null,
//         orggroup: null,
//         local_admin_permission: false,
//         participant_permission: true
//       },
//       answer: 277
//     }
//   ],
//   activity_type: 'MCQActivity'
// },
// {
//   id: 512,
//   question: {
//     id: 72,
//     question:
//       'True or false: an elevator pitch is a sales pitch.',
//     mcqchoice_set: [
//       {
//         id: 275,
//         order: 1,
//         choice_text: 'False',
//         is_correct: true,
//         explanation: 'Correct'
//       },
//       {
//         id: 274,
//         order: 0,
//         choice_text: 'True',
//         is_correct: false,
//         explanation: 'Incorrect'
//       }
//     ]
//   },
//   mcqactivityuseranswer_set: [
//     {
//       user: {
//         id: 2,
//         username: 'matt',
//         first_name: 'Matt',
//         last_name: 'Parson',
//         email: 'matt@mybenji.com',
//         verified_email: false,
//         job_title: 'CEO',
//         organization_name: 'Benji',
//         orggroup_name: 'Sales',
//         organization: 1,
//         orggroup: 1,
//         local_admin_permission: true,
//         participant_permission: true
//       },
//       answer: 275
//     },
//     {
//       user: {
//         id: 8,
//         username: 'khan',
//         first_name: 'khan',
//         last_name: '',
//         email: '',
//         verified_email: false,
//         job_title: null,
//         organization_name: null,
//         orggroup_name: null,
//         organization: null,
//         orggroup: null,
//         local_admin_permission: false,
//         participant_permission: true
//       },
//       answer: 275
//     }
//   ],
//   activity_type: 'MCQActivity'
// },
// {
//   id: 511,
//   question: {
//     id: 71,
//     question: 'How can you make your pitch more memorable?',
//     mcqchoice_set: [
//       {
//         id: 273,
//         order: 3,
//         choice_text: 'All of the above',
//         is_correct: true,
//         explanation: 'Correct!'
//       },
//       {
//         id: 272,
//         order: 2,
//         choice_text: 'Make it short',
//         is_correct: false,
//         explanation: 'Nope!'
//       },
//       {
//         id: 271,
//         order: 1,
//         choice_text: 'Make it surprising',
//         is_correct: false,
//         explanation: 'Not quite!'
//       },
//       {
//         id: 270,
//         order: 0,
//         choice_text: 'Make it relatable',
//         is_correct: false,
//         explanation: 'Incorrect'
//       }
//     ]
//   },
//   mcqactivityuseranswer_set: [
//     {
//       user: {
//         id: 2,
//         username: 'matt',
//         first_name: 'Matt',
//         last_name: 'Parson',
//         email: 'matt@mybenji.com',
//         verified_email: false,
//         job_title: 'CEO',
//         organization_name: 'Benji',
//         orggroup_name: 'Sales',
//         organization: 1,
//         orggroup: 1,
//         local_admin_permission: true,
//         participant_permission: true
//       },
//       answer: 273
//     },
//     {
//       user: {
//         id: 8,
//         username: 'khan',
//         first_name: 'khan',
//         last_name: '',
//         email: '',
//         verified_email: false,
//         job_title: null,
//         organization_name: null,
//         orggroup_name: null,
//         organization: null,
//         orggroup: null,
//         local_admin_permission: false,
//         participant_permission: true
//       },
//       answer: 273
//     }
//   ],
//   activity_type: 'MCQActivity'
// },
// {
//   id: 510,
//   question: {
//     id: 70,
//     question: 'What are the three C\'s of a good pitch?',
//     mcqchoice_set: [
//       {
//         id: 269,
//         order: 2,
//         choice_text: 'Compelling, charismatic, clear',
//         is_correct: false,
//         explanation: 'Nope!'
//       },
//       {
//         id: 268,
//         order: 1,
//         choice_text: 'Clear, catchy, concise',
//         is_correct: false,
//         explanation: 'Not quite!'
//       },
//       {
//         id: 267,
//         order: 0,
//         choice_text: 'Clear, compelling, concise',
//         is_correct: true,
//         explanation: 'Correct!'
//       }
//     ]
//   },
//   mcqactivityuseranswer_set: [
//     {
//       user: {
//         id: 2,
//         username: 'matt',
//         first_name: 'Matt',
//         last_name: 'Parson',
//         email: 'matt@mybenji.com',
//         verified_email: false,
//         job_title: 'CEO',
//         organization_name: 'Benji',
//         orggroup_name: 'Sales',
//         organization: 1,
//         orggroup: 1,
//         local_admin_permission: true,
//         participant_permission: true
//       },
//       answer: 269
//     },
//     {
//       user: {
//         id: 8,
//         username: 'khan',
//         first_name: 'khan',
//         last_name: '',
//         email: '',
//         verified_email: false,
//         job_title: null,
//         organization_name: null,
//         orggroup_name: null,
//         organization: null,
//         orggroup: null,
//         local_admin_permission: false,
//         participant_permission: true
//       },
//       answer: 269
//     }
//   ],
//   activity_type: 'MCQActivity'
// },
//     {
//       winning_user: {
//         id: 2,
//         username: 'matt',
//         first_name: 'Matt',
//         last_name: 'Parson',
//         email: 'matt@mybenji.com',
//         verified_email: false,
//         job_title: 'CEO',
//         organization_name: 'Benji',
//         orggroup_name: 'Sales',
//         organization: 1,
//         orggroup: 1,
//         local_admin_permission: true,
//         participant_permission: true
//       },
//       buildapitchblank_set: [
//         {
//           id: 26,
//           order: 0,
//           label: ' At',
//           temp_text: 'company name',
//           help_text: ' What company are you pitching?'
//         },
//         {
//           id: 27,
//           order: 1,
//           label: 'we help',
//           temp_text: 'the audience',
//           help_text:
//             ' Who do you help? Try and be as specific as possible (e.g. demographics, industry, size)'
//         },
//         {
//           id: 28,
//           order: 2,
//           label: 'with',
//           temp_text: 'the problem',
//           help_text:
//             'What needs, challenges and frustrations do your customers have?'
//         },
//         {
//           id: 29,
//           order: 3,
//           label: 'by',
//           temp_text: 'the solution',
//           help_text:
//             'How do you solve your target customer’s problem?'
//         },
//         {
//           id: 30,
//           order: 4,
//           label: 'because',
//           temp_text: 'the why',
//           help_text: 'Why is this problem worth solving?'
//         }
//       ],
//       pitch_summaries: [
//         {
//           user: 2,
//           buildapitchentry_set: [
//             {
//               buildapitchblank: 26,
//               value: 'a'
//             },
//             {
//               buildapitchblank: 27,
//               value: 'b'
//             },
//             {
//               buildapitchblank: 28,
//               value: 'c'
//             },
//             {
//               buildapitchblank: 29,
//               value: 'd'
//             },
//             {
//               buildapitchblank: 30,
//               value: 'e'
//             }
//           ],
//           votes: 2
//         },
//         {
//           user: 8,
//           buildapitchentry_set: [
//             {
//               buildapitchblank: 26,
//               value: 'f'
//             },
//             {
//               buildapitchblank: 27,
//               value: 'g'
//             },
//             {
//               buildapitchblank: 28,
//               value: 'h'
//             },
//             {
//               buildapitchblank: 29,
//               value: 'i'
//             },
//             {
//               buildapitchblank: 30,
//               value: 'j'
//             }
//           ],
//           votes: 0
//         }
//       ],
//       activity_type: 'BuildAPitchActivity'
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
//     },
//     {
//       id: 528,
//       length: 43.724356,
//       activity_type: 'LobbyActivity'
//     },
//     {
//       id: 525,
//       length: 9.964878,
//       activity_type: 'VideoActivity'
//     },
//     {
//       instructions:
//         'Generate your pitches, brainstorm, pitch and then vote!',
//       pitchomaticblank_set: [
//         {
//           id: 19,
//           order: 0,
//           label: 'You are pitching:',
//           pitchomaticblankchoice_set: [
//             {
//               id: 138,
//               value: 'Coca Cola'
//             },
//             {
//               id: 139,
//               value: 'SpaceX'
//             },
//             {
//               id: 140,
//               value: 'Tesla'
//             },
//             {
//               id: 141,
//               value: 'Disney'
//             },
//             {
//               id: 142,
//               value: 'Apple'
//             },
//             {
//               id: 143,
//               value: 'McDonalds'
//             },
//             {
//               id: 144,
//               value: 'Netflix'
//             },
//             {
//               id: 145,
//               value: 'WestJet'
//             },
//             {
//               id: 146,
//               value: 'IKEA'
//             },
//             {
//               id: 147,
//               value: 'Walmart'
//             },
//             {
//               id: 148,
//               value: 'Facebook'
//             },
//             {
//               id: 149,
//               value: 'NHL'
//             }
//           ]
//         },
//         {
//           id: 20,
//           order: 1,
//           label: 'You are pitching to:',
//           pitchomaticblankchoice_set: [
//             {
//               id: 150,
//               value: 'a CTO'
//             },
//             {
//               id: 151,
//               value: 'a venture capitalist'
//             },
//             {
//               id: 152,
//               value: 'a 5 year old'
//             },
//             {
//               id: 153,
//               value: 'an 86 year old grandmother'
//             },
//             {
//               id: 154,
//               value: 'a group of college students'
//             },
//             {
//               id: 155,
//               value: 'academics at a conference'
//             },
//             {
//               id: 156,
//               value: 'an elevator full of random people'
//             }
//           ]
//         },
//         {
//           id: 21,
//           order: 2,
//           label: 'And the technique you need to use is:',
//           pitchomaticblankchoice_set: [
//             {
//               id: 157,
//               value: 'a story'
//             },
//             {
//               id: 158,
//               value: 'a surprising fact'
//             },
//             {
//               id: 159,
//               value: 'an analogy'
//             }
//           ]
//         }
//       ],
//       feedbackquestion_set: [
//         {
//           id: 86,
//           question_type: 'rating_agreedisagree',
//           question_text: 'The pitch was compelling',
//           is_combo: false,
//           combo_text: null
//         },
//         {
//           id: 87,
//           question_type: 'rating_agreedisagree',
//           question_text:
//             'The pitch answered all the essential questions',
//           is_combo: false,
//           combo_text: null
//         },
//         {
//           id: 88,
//           question_type: 'rating_agreedisagree',
//           question_text: 'Overall, the pitch was excellent',
//           is_combo: true,
//           combo_text: null
//         }
//       ],
//       pitchomaticgroupmembers: [
//         {
//           user: {
//             id: 2,
//             username: 'matt',
//             first_name: 'Matt',
//             last_name: 'Parson',
//             email: 'matt@mybenji.com',
//             verified_email: false,
//             job_title: 'CEO',
//             organization_name: 'Benji',
//             orggroup_name: 'Sales',
//             organization: 1,
//             orggroup: 1,
//             local_admin_permission: true,
//             participant_permission: true
//           },
//           pitch_prep_text: 'Matt wrote this pitch as a test',
//           pitch: {
//             pitchomaticgroupmemberpitchchoice_set: [
//               {
//                 pitchomaticblank: 19,
//                 choice: 138
//               },
//               {
//                 pitchomaticblank: 20,
//                 choice: 150
//               },
//               {
//                 pitchomaticblank: 21,
//                 choice: 158
//               }
//             ]
//           },
//           pitchomaticfeedback_set: [
//             {
//               user: 8,
//               feedbackquestion: 86,
//               rating_answer: 4,
//               text_answer: '4'
//             },
//             {
//               user: 8,
//               feedbackquestion: 87,
//               rating_answer: 5,
//               text_answer: '5'
//             },
//             {
//               user: 8,
//               feedbackquestion: 88,
//               rating_answer: 5,
//               text_answer: '5'
//             }
//           ]
//         },
//         {
//           user: {
//             id: 8,
//             username: 'khan',
//             first_name: 'khan',
//             last_name: '',
//             email: '',
//             verified_email: false,
//             job_title: null,
//             organization_name: null,
//             orggroup_name: null,
//             organization: null,
//             orggroup: null,
//             local_admin_permission: false,
//             participant_permission: true
//           },
//           pitch_prep_text: 'Mahin wrote these pitch notes',
//           pitch: {
//             pitchomaticgroupmemberpitchchoice_set: [
//               {
//                 pitchomaticblank: 19,
//                 choice: 145
//               },
//               {
//                 pitchomaticblank: 20,
//                 choice: 150
//               },
//               {
//                 pitchomaticblank: 21,
//                 choice: 157
//               }
//             ]
//           },
//           pitchomaticfeedback_set: [
//             {
//               user: 2,
//               feedbackquestion: 86,
//               rating_answer: 5,
//               text_answer: '5'
//             },
//             {
//               user: 2,
//               feedbackquestion: 87,
//               rating_answer: 5,
//               text_answer: '5'
//             },
//             {
//               user: 2,
//               feedbackquestion: 88,
//               rating_answer: 3,
//               text_answer: '3'
//             }
//           ]
//         }
//       ],
//       activity_type: 'PitchoMaticActivity'
//     },
//     {
//       id: 523,
//       length: 16.457316,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 522,
//       length: 8.18005,
//       activity_type: 'DiscussionActivity'
//     },
//     {
//       id: 521,
//       length: 54.268166,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 520,
//       length: 3.13295,
//       activity_type: 'DiscussionActivity'
//     },
//     {
//       id: 519,
//       length: 8.690269,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 518,
//       length: 3.369051,
//       activity_type: 'DiscussionActivity'
//     },
//     {
//       id: 517,
//       length: 4.980677,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 516,
//       length: 4.625612,
//       activity_type: 'PairGroupingActivity'
//     },
//     {
//       id: 515,
//       length: 5.635346,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 509,
//       length: 42.874684,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 507,
//       length: 3.720349,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 505,
//       length: 4.958442,
//       activity_type: 'VideoActivity'
//     },
//     {
//       id: 527,
//       length: null,
//       activity_type: 'VideoActivity'
//     }
//   ]
// };

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
