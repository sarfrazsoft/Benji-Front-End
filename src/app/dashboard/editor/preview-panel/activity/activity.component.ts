import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ActivityTypes as Acts } from 'src/app/globals';
import {
  MainScreenBrainstormingActivityComponent,
  MainScreenFeedbackActivityComponent,
  MainScreenPopQuizComponent,
  MainScreenTitleActivityComponent,
  ParticipantBrainstormingActivityComponent,
  ParticipantFeedbackActivityComponent,
  ParticipantPopQuizComponent,
  ParticipantTitleActivityComponent,
} from 'src/app/pages';
import { PreviewActivity } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-preview-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: PreviewActivity;
  componentRef: ComponentRef<any>;
  oldActivityType;
  @ViewChild('previewEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {}
  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  ngOnChanges() {
    if (this.data) {
      const content = this.data.content;
      if (this.data.activity_type === Acts.title) {
        if (this.componentRef) {
          this.componentRef.destroy();
        }
        let msAct = null;
        if (this.data.screenType === 'mainScreen') {
          msAct = this.cfr.resolveComponentFactory(MainScreenTitleActivityComponent);
        } else {
          msAct = this.cfr.resolveComponentFactory(ParticipantTitleActivityComponent);
        }
        this.componentRef = this.entry.createComponent(msAct);

        this.componentRef.instance.activityState = {
          activity_type: this.data.activity_type,
          lesson: Lesson,
          lesson_run: Lesson_run,
          titleactivity: {
            activity_id: '1605110364952',
            activity_type: this.data.activity_type,
            auto_next: true,
            description: null,
            end_time: null,
            facilitation_status: 'running',
            hide_timer: false,
            id: 507,
            is_paused: true,
            main_title: content.main_title ? content.main_title : 'Header text',
            next_activity: 4,
            next_activity_delay_seconds: null,
            next_activity_start_timer: null,
            polymorphic_ctype: 46,
            run_number: 0,
            start_time: '2020-11-11T12:30:41.270208-05:00',
            title_image: this.data.content.title_image ? content.title_image : null,
            title_text: content.title_text ? content.title_text : 'Paragraph text',
          },
        };
      } else if (this.data.activity_type === Acts.brainStorm) {
        if (this.componentRef) {
          this.componentRef.destroy();
        }
        let msAct = null;
        if (this.data.screenType === 'mainScreen') {
          msAct = this.cfr.resolveComponentFactory(MainScreenBrainstormingActivityComponent);
        } else {
          msAct = this.cfr.resolveComponentFactory(ParticipantBrainstormingActivityComponent);
        }
        this.componentRef = this.entry.createComponent(msAct);
        const categorizeFlag =
          content.brainstormcategory_set && content.brainstormcategory_set.length === 0 ? false : true;
        const categoryset =
          content.brainstormcategory_set && content.brainstormcategory_set.length
            ? content.brainstormcategory_set
            : [];
        const instructions = content.instructions ? content.instructions : 'Enter your question';

        this.componentRef.instance.activityState = {
          activity_type: this.data.activity_type,
          lesson: Lesson,
          lesson_run: Lesson_run,
          brainstormactivity: {
            activity_id: '1604944307099',
            activity_type: this.data.activity_type,
            all_participants_submitted: false,
            all_participants_voted: false,
            auto_next: true,
            brainstormcategory_set: categoryset,
            categorize_flag: categorizeFlag,
            description: null,
            end_time: null,
            facilitation_status: 'running',
            hide_timer: true,
            id: 524,
            instructions: instructions,
            is_paused: true,
            max_participant_submissions: content.max_participant_submissions,
            max_participant_votes: 1,
            next_activity: null,
            next_activity_delay_seconds: 0,
            next_activity_start_timer: null,
            participant_submission_counts: [],
            participant_vote_counts: [],
            polymorphic_ctype: 91,
            run_number: 0,
            start_time: '2020-11-13T13:42:50.945227-05:00',
            submission_complete: false,
            submission_countdown_timer: null,
            submission_seconds: 10000,
            submitted_participants: [],
            voted_participants: [],
            voting_complete: false,
            voting_countdown_timer: null,
            voting_seconds: 0,
          },
        };
        this.componentRef.instance.peakBackState = false;
        const activityStage: Subject<string> = new Subject<string>();
        this.componentRef.instance.activityStage = activityStage.asObservable();
        // this.componentRef.instance.peakBackState = true;
      } else if (this.data.activity_type === Acts.mcq) {
        if (this.componentRef) {
          this.componentRef.destroy();
        }
        let title = 'Enter title';
        if (content.titlecomponent) {
          title = content.titlecomponent.title ? content.titlecomponent.title : 'Enter title';
        }
        let questionText = 'Enter your question';
        let options = [
          { order: 0, choice_text: 'choice 1', is_correct: false, explanation: null },
          { order: 0, choice_text: 'choice 2', is_correct: false, explanation: null },
          { order: 0, choice_text: 'choice 3', is_correct: false, explanation: null },
        ];
        if (content.question) {
          const q = content.question;
          questionText = q.question ? q.question : 'Enter your question';
          options = q.mcqchoice_set.length ? q.mcqchoice_set : options;
        }

        let msAct = null;
        if (this.data.screenType === 'mainScreen') {
          msAct = this.cfr.resolveComponentFactory(MainScreenPopQuizComponent);
        } else {
          msAct = this.cfr.resolveComponentFactory(ParticipantPopQuizComponent);
        }

        this.componentRef = this.entry.createComponent(msAct);
        this.componentRef.instance.editor = true;
        this.componentRef.instance.activityState = {
          activity_type: this.data.activity_type,
          lesson: Lesson,
          lesson_run: Lesson_run,
          mcqactivity: {
            activity_id: '1605649483199',
            activity_type: 'MCQActivity',
            all_participants_answered: false,
            answered_participants: [],
            auto_next: false,
            description: null,
            end_time: null,
            facilitation_status: 'running',
            hide_timer: false,
            id: 540,
            is_paused: true,
            next_activity: null,
            next_activity_delay_seconds: 10000,
            next_activity_start_timer: null,
            polymorphic_ctype: 65,
            question: {
              id: 39,
              mcqchoice_set: options,
              question: questionText,
            },
            // question: content.question,
            question_seconds: 600,
            question_timer: null,
            quiz_label: null,
            quiz_leaderboard: null,
            run_number: 0,
            start_time: '2020-11-17T16:50:24.144780-05:00',
            titlecomponent: {
              participant_instructions: 'Answer the following question',
              screen_instructions: 'Answer the following question',
              title: title,
              title_image: 'emoji://1F642',
            },
          },
        };
      } else if (this.data.activity_type === Acts.feedback) {
        if (this.componentRef) {
          this.componentRef.destroy();
        }

        let title = 'Enter title';
        let instructions = 'Answer the following question';
        if (content.titlecomponent) {
          const t = content.titlecomponent;
          title = t.title ? t.title : 'Enter title';
          instructions = t.screen_instructions ? t.screen_instructions : 'Answer the following question';
        }
        let feedbackquestion_set = [];
        if (content.feedbackquestion_set.length) {
          feedbackquestion_set = content.feedbackquestion_set;
        }
        let msAct = null;
        if (this.data.screenType === 'mainScreen') {
          msAct = this.cfr.resolveComponentFactory(MainScreenFeedbackActivityComponent);
        } else {
          msAct = this.cfr.resolveComponentFactory(ParticipantFeedbackActivityComponent);
        }
        this.componentRef = this.entry.createComponent(msAct);
        this.componentRef.instance.activityState = {
          activity_type: this.data.activity_type,
          lesson: Lesson,
          lesson_run: Lesson_run,
          feedbackactivity: {
            activity_id: '1606241145122',
            activity_type: 'FeedbackActivity',
            answered_participants: [],
            auto_next: true,
            description: null,
            end_time: null,
            facilitation_status: 'running',
            feedbackquestion_set: feedbackquestion_set,
            id: 546,
            is_paused: true,
            next_activity: null,
            next_activity_delay_seconds: 10000,
            next_activity_start_timer: null,
            polymorphic_ctype: 60,
            run_number: 0,
            start_time: '2020-11-24T13:16:30.794385-05:00',
            titlecomponent: {
              participant_instructions: instructions,
              screen_instructions: instructions,
              title: title,
              title_image: 'emoji://1F642',
            },
          },
        };
      }
      this.oldActivityType = this.data.activity_type;
    }
  }
}

export const Lesson = {
  creation_time: '',
  effective_permission: null,
  id: 152,
  is_shared: false,
  last_edited: '',
  lesson_description: '',
  lesson_id: null,
  lesson_length_minutes: null,
  lesson_name: 'Lesson Name',
  owner: 3,
  public_permission: null,
  single_user_lesson: false,
  standardize: true,
  team: null,
  team_permission: null,
};

export const Lesson_run = {
  end_time: null,
  host: {
    id: 3,
    username: '',
    first_name: '',
    last_name: '',
    teammembership_set: [],
  },
  id: 101,
  is_accessible: false,
  lesson: Lesson,
  lessonrun_code: 1234,
  participant_set: [],
  screen_socket: '',
  start_time: '',
  theme: null,
  theme_label: null,
};
