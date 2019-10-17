export const pom = {
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
    }
  ]
};
