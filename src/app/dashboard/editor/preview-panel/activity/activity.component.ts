import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ActivityTypes as Acts } from 'src/app/globals';
import { MainScreenBrainstormingActivityComponent, MainScreenTitleActivityComponent } from 'src/app/pages';

@Component({
  selector: 'benji-preview-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, OnChanges {
  @Input() data;
  componentRef: ComponentRef<any>;
  oldActivityType;
  @ViewChild('previewEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.data) {
      const content = this.data.content;
      if (this.data.activity_type === Acts.title) {
        if (this.oldActivityType !== this.data.activity_type) {
          const msAct = this.cfr.resolveComponentFactory(MainScreenTitleActivityComponent);
          this.componentRef = this.entry.createComponent(msAct);
        }
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
            title_image: this.data.content.title_image ? content.title_image : 'emoji://1F642',
            title_text: content.title_text ? content.title_text : 'Paragraph text',
          },
        };
      } else if (this.data.activity_type === Acts.brainStorm) {
        if (this.componentRef) {
          this.componentRef.destroy();
        }
        // if (this.oldActivityType !== this.data.activity_type) {
        const msAct = this.cfr.resolveComponentFactory(MainScreenBrainstormingActivityComponent);
        this.componentRef = this.entry.createComponent(msAct);
        // }
        const categorizeFlag =
          content.brainstormcategory_set && content.brainstormcategory_set.length === 0 ? false : true;
        const categoryset =
          content.brainstormcategory_set && content.brainstormcategory_set.length
            ? content.brainstormcategory_set
            : [];
        const instructions = content.instructions ? content.instructions : 'Enter your question';
        console.log(categorizeFlag, categoryset, instructions);

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
            max_participant_submissions: 1,
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
        this.componentRef.instance.peakBackState = true;
        const activityStage: Subject<string> = new Subject<string>();
        this.componentRef.instance.activityStage = activityStage.asObservable();
        // this.componentRef.instance.peakBackState = true;
        // this.componentRef.changeDetectorRef.detectChanges();
        // this.componentRef.changeDetectorRef.checkNoChanges();
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
