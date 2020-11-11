import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivityTypes as Acts } from 'src/app/globals';
import { MainScreenTitleActivityComponent } from 'src/app/pages';

@Component({
  selector: 'benji-preview-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, OnChanges {
  @Input() data;
  componentRef;
  oldActivityType;
  @ViewChild('previewEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.data) {
      if (this.data.activity_type === Acts.title) {
        if (this.oldActivityType !== this.data.activity_type) {
          const msTAC = this.cfr.resolveComponentFactory(MainScreenTitleActivityComponent);
          this.componentRef = this.entry.createComponent(msTAC);
        }
        const content = this.data.content;
        this.componentRef.instance.activityState = {
          activity_type: 'TitleActivity',
          lesson: Lesson,
          lesson_run: Lesson_run,
          titleactivity: {
            activity_id: '1605110364952',
            activity_type: 'TitleActivity',
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
