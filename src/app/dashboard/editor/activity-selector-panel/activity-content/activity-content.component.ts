import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';
import { QuestionSet } from './services/question-control.service';

import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { cloneDeep, mapValues, reverse, sortBy } from 'lodash';
import { map } from 'rxjs/operators';
import { ActivityTypes } from 'src/app/globals';

@Component({
  selector: 'benji-activity-content',
  templateUrl: './activity-content.component.html',
  styleUrls: ['./activity-content.component.scss'],
})
export class ActivityContentComponent implements OnInit {
  constructor(private store: Store<fromStore.EditorState>, private formlyJsonschema: FormlyJsonschema) {}
  at: typeof ActivityTypes = ActivityTypes;
  activity$: Observable<any>;
  content$: Observable<any>;
  possibleActivities$: Observable<any>;
  fieldTypes = FieldTypes;
  questions$: Observable<Array<QuestionSet>>;
  showQuestions = false;
  typingTimer;

  form = new FormGroup({});
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  showSelectActivityMsg = false;

  ngOnInit() {
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);
    this.possibleActivities$ = this.store.select(fromStore.getAllPossibleActivities);

    this.content$ = this.store.select(fromStore.getSelectedLessonActivityContent);

    combineLatest([this.activity$, this.possibleActivities$, this.content$])
      .pipe(
        map(([a$, b$, c$]) => ({
          activity: a$,
          possibleActivities: b$,
          content: c$,
        }))
      )
      .subscribe((pair) => {
        this.showSelectActivityMsg = false;
        if (pair.activity && !pair.activity.empty && pair.possibleActivities.length) {
          const act = cloneDeep(pair.activity);
          const act_type = cloneDeep(pair.activity.activity_type);
          const s = pair.possibleActivities.filter((pa) => pa.id === act_type)[0].schema;
          const schema = cloneDeep(s);
          // console.log(pair);
          // internal_type = EmojiURLField indicates that the field is for emoji
          // map to intercept schema and make changes to fields
          // make activity_id readonly
          const fields = this.formlyJsonschema.toFieldConfig(schema as any, {
            map: (mappedField: FormlyFieldConfig, mapSource: any) => {
              if (mapSource.internal_type === 'EmojiURLField') {
                if (AllowEmojiDic[act.activity_type]) {
                  mappedField.type = 'emoji';
                  mappedField.wrappers = ['form-field'];
                  mappedField.templateOptions.label = 'Emoji';
                } else {
                  mappedField.hide = true;
                }
              }
              if (mapSource.field_name === 'activity_id') {
                mappedField.hide = true;
                mappedField.templateOptions.readonly = true;
              }
              if (mapSource.field_name === 'description') {
                mappedField.hide = true;
                mappedField.templateOptions.readonly = true;
              }
              // for MCQ activity
              if (act.activity_type === this.at.mcq) {
                if (mapSource.internal_type === 'MCQActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.internal_type === 'MCQChoiceSerializer') {
                  mappedField.type = 'mcqChoice';
                } else if (mapSource.internal_type === 'MCQQuestionSerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.internal_type === 'TitleComponentSerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'question_seconds') {
                  mappedField.templateOptions.label = 'Timer to answer';
                  mappedField.templateOptions.type = 'number';
                } else if (mapSource.field_name === 'title') {
                } else if (mapSource.field_name === 'screen_instructions') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 'Answer the following question';
                } else if (mapSource.field_name === 'participant_instructions') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 'Answer the following question';
                } else if (mapSource.field_name === 'quiz_label') {
                  mappedField.type = 'boolean';
                  mappedField.defaultValue = false;
                  mappedField.templateOptions.label = 'Add Leaderboard';
                  delete mappedField.templateOptions.maxLength;
                  delete mappedField.templateOptions.minLength;
                } else if (mapSource.field_name === 'auto_next') {
                  // auto_next is hidden
                  // if user sets next activity delay seconds then it is
                  // set to true else false
                  mappedField.defaultValue = false;
                  mappedField.templateOptions.label = 'Auto forward after results';
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['helpText'] = 'Auto-forward after how many seconds?';
                  mappedField.templateOptions['labelForCheckbox'] = 'Auto forward after results';
                  mappedField.defaultValue = 10000;
                }
                // console.log(mappedField);
              } else if (act.activity_type === this.at.title) {
                // for TitleActivity
                if (mapSource.internal_type === 'TitleActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'main_title') {
                  mappedField.templateOptions.label = 'Header';
                } else if (mapSource.field_name === 'title_text') {
                  mappedField.type = 'textarea';
                  mappedField.templateOptions.label = 'Subheader';
                  mappedField.templateOptions.placeholder = 'Paragraph text';
                } else if (mapSource.field_name === 'title_image') {
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = 'Duration for timer';
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.templateOptions.label = 'Auto forward after timer';
                  mappedField.hide = true;
                }
              } else if (act.activity_type === this.at.brainStorm) {
                if (mapSource.internal_type === 'BrainstormActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'instructions') {
                  mappedField.templateOptions.label = 'Prompt';
                  mappedField.templateOptions.placeholder = 'Enter your question';
                } else if (mapSource.field_name === 'max_participant_submissions') {
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = 'Submissions';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Allow multiple submissions';
                  mappedField.templateOptions['helpText'] = 'How many submissions can a participant submit?';
                } else if (mapSource.field_name === 'categorize_flag') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'brainstormcategory_set') {
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions['labelForCheckbox'] = 'Add Categories';
                  mappedField.templateOptions.label = 'Categories';
                  mappedField.templateOptions['hideLabel'] = true;
                } else if (mapSource.field_name === 'removed') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'voting_seconds') {
                  mappedField.defaultValue = 0;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add Voting Stage';
                  mappedField.templateOptions['helpText'] = 'How long does the voting stage last?';
                } else if (mapSource.field_name === 'max_participant_votes') {
                  mappedField.hideExpression = '!model.voting_seconds';
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.defaultValue = 0;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add Winner screen';
                  mappedField.templateOptions['helpText'] = 'How long does the winner stage last?';
                } else if (mapSource.field_name === 'submission_seconds') {
                  mappedField.defaultValue = 10000;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.templateOptions['helpText'] = 'How long does the submission stage last?';
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.templateOptions.label = 'Auto forward';
                }
              } else if (act.activity_type === this.at.video) {
                if (mapSource.internal_type === 'VideoActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                }
              }
              // if activity is nullable then send it to special component
              // over there it will have a special checkbox.
              // allow that textbox to be anything right now

              // if (mapSource['x-nullable']) {
              // mappedField.wrappers = ['benji-reveal-field-wrapper'];
              // }
              return mappedField;
            },
          });
          const reversedOrder = cloneDeep(OrderForActivities[act.activity_type]);
          const content = cloneDeep(pair.content);
          reverse(reversedOrder);
          fields.fieldGroup = fields.fieldGroup.sort((a, b) => {
            return reversedOrder.indexOf(b.key as string) - reversedOrder.indexOf(a.key as string);
          });

          this.fields = [fields];
          this.model = {
            activity_type: act.activity_type,
            activity_id: act.id.toString(),
            ...content,
          };
          this.showQuestions = true;
        } else if (pair.activity && pair.activity.empty) {
          this.showSelectActivityMsg = true;
        }
      });

    this.form.valueChanges.pipe(debounceTime(2000)).subscribe((val) => {
      const b = cloneDeep(this.model);
      // processing before submitting to BE
      if (b.activity_type === this.at.title) {
        // If the user didn't set next activity delay seconds
        if (b.next_activity_delay_seconds === 0) {
          b.hide_timer = true;
          b.next_activity_delay_seconds = 10000;
        } else {
          b.hide_timer = false;
        }
      } else if (b.activity_type === this.at.mcq) {
        if (!b.auto_next) {
          b.next_activity_delay_seconds = 10;
        }
        if (b.quiz_label) {
          b.quiz_label = 'leader_board';
        } else {
          delete b.quiz_label;
        }
      }
      this.store.dispatch(new fromStore.AddActivityContent(b));
      // console.log(this.model);
    });
  }

  saveValues($event) {
    console.log($event);
  }

  onSubmit() {
    // const b = cloneDeep(this.model);
    // this.store.dispatch(new fromStore.AddActivityContent(b));
    // console.log(this.model);
  }

  // on keyup, start the countdown
  typingStoped(event) {
    // clearTimeout(this.typingTimer);
    // this.typingTimer = setTimeout(() => {
    //   this.onSubmit();
    // }, 1500);
  }

  // on keydown, clear the countdown
  typingStarted() {
    // clearTimeout(this.typingTimer);
  }
}

export const AllowEmojiDic = {
  TitleActivity: true,
  MCQActivity: false,
  VideoActivity: false,
  BrainstormActivity: false,
};

export const OrderForActivities = {
  TitleActivity: ['main_title', 'title_text', 'title_image', 'next_activity_delay_seconds'],
  BrainstormActivity: [
    'instructions',
    'max_participant_submissions',
    'categorize_flag',
    'brainstormcategory_set',
    'voting_seconds',
    'max_participant_votes',
    'next_activity_delay_seconds',
    'submission_seconds',
  ],
  MCQActivity: ['titlecomponent', 'title', 'question', 'mcqchoice_set', 'question_seconds', 'quiz_label'],
  VideoActivity: ['video_url', 'auto_next', 'next_activity_delay_seconds'],
};
