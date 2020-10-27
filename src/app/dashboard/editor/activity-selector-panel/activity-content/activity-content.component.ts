import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { cloneDeep, mapValues, reverse, sortBy } from 'lodash';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ActivityTypes } from 'src/app/globals';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';
import { QuestionSet } from './services/question-control.service';

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
        if (pair.activity && pair.activity.empty === false && pair.possibleActivities.length) {
          const act = cloneDeep(pair.activity);
          const act_type = cloneDeep(pair.activity.activity_type);
          const s = pair.possibleActivities.filter((pa) => pa.id === act_type)[0].schema;
          const schema = cloneDeep(s);
          const content = cloneDeep(pair.content);

          // Case study activiy
          // set grouping_activity_id to show if External or Internal grouping activity
          if (act.activity_type === this.at.caseStudy) {
            if (content) {
              if (content.grouping_activity_type === 'ExternalGroupingActivity') {
                content.grouping_activity_id = true;
              } else if (content.grouping_activity_type === 'SingleGroupingActivity') {
                content.grouping_activity_id = false;
              } else if (!content.grouping_activity_type) {
                content.grouping_activity_id = true;
              }
            }
          }

          // MCQActivity
          // Add a field for 'Show distribution of results' feature in mcqActivity
          if (act.activity_type === this.at.mcq) {
            schema.properties['show_distribution'] = {
              description: 'Show distribution of results after this stage',
              field_name: 'show_distribution',
              internal_type: 'CharField',
              required: false,
              title: 'Show distribution of results',
              type: 'boolean',
              default: false,
            };
          }

          const fields = this.formlyJsonschema.toFieldConfig(schema as any, {
            map: (mappedField: FormlyFieldConfig, mapSource: any) => {
              if (mapSource.internal_type === 'EmojiURLField') {
                if (AllowEmojiDic[act.activity_type]) {
                  mappedField.type = 'emoji';
                  mappedField.wrappers = ['form-field'];
                  mappedField.templateOptions.label = 'Emoji';
                } else {
                  mappedField.hide = true;
                  mappedField.defaultValue = 'emoji://1F642';
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
                  mappedField.defaultValue = 10;
                } else if (mapSource.field_name === 'show_distribution') {
                  mappedField.templateOptions.label = 'Show distribution of results';
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
                  mappedField.defaultValue = 10000;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.templateOptions['helpText'] = 'How long does the slide last?';
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
                  mappedField.templateOptions['helpText'] =
                    'Predefine categories for the brainstorm. ' +
                    'You can always add categories during a session.';
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                } else if (mapSource.field_name === 'category_name') {
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                } else if (mapSource.internal_type === 'BrainstormCategorySerializer') {
                  mappedField.templateOptions.label = '';
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
              } else if (act.activity_type === this.at.caseStudy) {
                if (mapSource.internal_type === 'CaseStudyActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'participant_instructions') {
                  mappedField.type = 'textarea';
                } else if (mapSource.field_name === 'case_study_details') {
                  mappedField.templateOptions.label = 'Worksheet details';
                  mappedField.type = 'textarea';
                } else if (mapSource.field_name === 'casestudyquestion_set') {
                  mappedField.templateOptions.label = 'Work Areas';
                  // mappedField.type = 'caseStudyQuestions';
                  // mappedField.wrappers = ['benji-field-wrapper'];
                  mappedField.templateOptions['helpText'] =
                    'Work areas are where your participants can collaboratively answer questions.';
                } else if (mapSource.internal_type === 'CaseStudyQuestionSerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'question_text') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'activity_title') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'grouping_activity_id') {
                  // TODO check if it comes with a model value and process
                  if (content && content.grouping_activity_id) {
                  }
                  mappedField.type = 'boolean';
                  mappedField.templateOptions.label = 'Add External grouping';
                  mappedField.defaultValue = true;
                  mappedField.templateOptions['hideRequiredMarker'] = true;
                  delete mappedField.templateOptions.required;
                  delete mappedField.templateOptions.maxLength;
                  delete mappedField.templateOptions.minLength;
                } else if (mapSource.field_name === 'mainscreen_instructions') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'activity_seconds') {
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = 'Duration for timer';
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.defaultValue = 10000;
                }
                // else if (mapSource.field_name === 'grouping_activity_type') {
                //   // mappedField.hide = true;
                // }
              } else if (act.activity_type === this.at.feedback) {
                if (mapSource.internal_type === 'FeedbackActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'titlecomponent') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'participant_instructions') {
                  mappedField.hide = true;
                  mappedField.templateOptions.required = false;
                } else if (mapSource.field_name === 'screen_instructions') {
                  mappedField.templateOptions.label = 'Instructions';
                } else if (mapSource.internal_type === 'FeedbackQuestionSerializer') {
                  mappedField.templateOptions.label = '';
                  mappedField.type = 'feedbackQuestion';
                } else if (mapSource.field_name === 'combo_text') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'is_combo') {
                  mappedField.hide = true;
                  mappedField.defaultValue = false;
                } else if (mapSource.field_name === 'question_text') {
                } else if (mapSource.field_name === 'question_type') {
                  mappedField.templateOptions.required = false;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.defaultValue = 10000;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.templateOptions['helpText'] =
                    'How long does the feedback submission stage last?';
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.templateOptions.label = 'Auto Forward';
                }
              } else if (act.activity_type === this.at.genericRoleplay) {
                if (mapSource.internal_type === 'GenericRoleplayActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'genericroleplayrole_set') {
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['addLabel'] = 'Add role';
                } else if (mapSource.internal_type === 'GenericRolePlayRoleSerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'name') {
                  mappedField.templateOptions.label = 'Role Title';
                } else if (mapSource.field_name === 'instructions') {
                  mappedField.templateOptions.label = 'Role Instructions';
                } else if (mapSource.field_name === 'short_instructions') {
                  mappedField.hide = true;
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'image_url') {
                  mappedField.templateOptions.label = 'Role Icon';
                } else if (mapSource.field_name === 'allow_multiple') {
                  mappedField.templateOptions.label = 'Allow duplicates';
                  mappedField.defaultValue = true;
                } else if (mapSource.field_name === 'is_non_interactive') {
                  mappedField.templateOptions.label = 'Is this role an observer';
                  mappedField.defaultValue = true;
                } else if (mapSource.field_name === 'feedbackquestions') {
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['addLabel'] = 'Add question';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
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
        }
      });

    this.form.valueChanges.pipe(debounceTime(500)).subscribe((val) => {
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
          b.next_activity_delay_seconds = 10000;
        }
        // if (b.show_distribution && !b.quiz_label) {
        //   b.next_activity_delay_seconds = 0;
        // }
        if (b.quiz_label) {
          b.quiz_label = 'leader_board';
        } else {
          delete b.quiz_label;
        }
      } else if (b.activity_type === this.at.caseStudy) {
        if (b.grouping_activity_id) {
          b['grouping_activity_type'] = 'ExternalGroupingActivity';
          // add ExternalGroupingActivity in the reducer
          // activity_type: ExternalGroupingActivity
          // description: A way to group people into groups.
          // next_activity_delay_seconds: 0
          // grouping_seconds: 300
          //
          // TODO
          // before saving the reducer will be called for add content
          // over there you'll have to add the said activities not here
          //
          // TODO
          // when you encounter these activities in the loadlessonactivities reducers
          // don't add them, just ignore them
        } else {
          b['grouping_activity_type'] = 'SingleGroupingActivity';
          // add SingleGroupingActivity in the reducer
          // activity_type: SingleGroupingActivity
          //           description: 'Dummy Description'
          //           grouping_seconds: 0
          //           next_activity_delay_seconds: 0
        }
      } else if (b.activity_type === this.at.feedback) {
        b.titlecomponent.participant_instructions = b.titlecomponent.screen_instructions;
      } else if (b.activity_type === this.at.brainStorm) {
        b.brainstormcategory_set = b.brainstormcategory_set.filter(
          (obj) => obj && obj.category_name && obj.category_name.length !== 0
        );
      } else if (b.activity_type === this.at.genericRoleplay) {
        b.instructions = b.short_instructions;
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
  FeedbackActivity: false,
  GenericRoleplayActivity: true,
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
  CaseStudyActivity: [
    'participant_instructions',
    'note_taker_instructions',
    'case_study_details',
    'casestudyquestion_set',
  ],
  FeedbackActivity: [
    'titlecomponent',
    'main_title',
    'title_text',
    'feedbackquestion_set',
    'next_activity_delay_seconds',
    'auto_next',
  ],
  GenericRoleplayActivity: ['genericroleplayrole_set', 'instructions', 'name'],
};
