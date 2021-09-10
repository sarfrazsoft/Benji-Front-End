import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { On, Store } from '@ngrx/store';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { cloneDeep, mapValues, reverse, sortBy } from 'lodash';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ActivityTitles, ActivityTypes } from 'src/app/globals';
import { BuildAPitchService } from 'src/app/services';
import { OverviewLessonActivity } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { FieldTypes } from '../../models/activity.model';
import * as fromStore from '../../store';
import { QuestionSet } from './services/question-control.service';

@Component({
  selector: 'benji-activity-content',
  templateUrl: './activity-content.component.html',
})
export class ActivityContentComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<fromStore.EditorState>,
    private formlyJsonschema: FormlyJsonschema,
    private utilsService: UtilsService,
    private buildAPitchService: BuildAPitchService
  ) {}
  at: typeof ActivityTypes = ActivityTypes;
  activity$: Observable<OverviewLessonActivity>;
  content$: Observable<any>;
  selectedLessonActivityContent;
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

    this.content$.subscribe((val) => (this.selectedLessonActivityContent = val));

    combineLatest([this.activity$, this.possibleActivities$])
      .pipe(
        map(([a$, b$]) => ({
          activity: a$,
          possibleActivities: b$,
        }))
      )
      .subscribe((pair) => {
        if (pair.activity && pair.activity.empty === false && pair.possibleActivities.length) {
          const act = cloneDeep(pair.activity);
          const act_type = cloneDeep(pair.activity.activity_type);
          const s = pair.possibleActivities.filter((pa) => pa.id === act_type)[0].schema;
          const schema = cloneDeep(s);
          const content = cloneDeep(this.selectedLessonActivityContent);
          // Case study activiy
          // set grouping_activity_id to show if External or Internal grouping activity
          if (act.activity_type === this.at.caseStudy || act.activity_type === this.at.genericRoleplay) {
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
              //
              // Emoji field
              if (mapSource.internal_type === 'EmojiURLField') {
                if (AllowEmojiDic[act.activity_type]) {
                  mappedField.type = 'emoji';
                  mappedField.wrappers = ['form-field'];
                  mappedField.templateOptions.label = 'Emoji';
                  mappedField.defaultValue = 'emoji://1F642';
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
                  mappedField.templateOptions.label = 'Time to answer';
                  mappedField.type = 'seconds';
                } else if (mapSource.field_name === 'title') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 'Question';
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
                  mappedField.defaultValue = true;
                  mappedField.templateOptions.label = 'Auto forward after results';
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'show_distribution') {
                  mappedField.templateOptions.label = 'Graph of participant answers';
                  mappedField.templateOptions.description =
                    'If you want to see how people answered then make sure this option is selected.' +
                    ' If you want a poll question, you can create a question without any correct ' +
                    ' answers and then select this option.';
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.hide = true;
                  mappedField.defaultValue = false;
                } else if (mapSource.field_name === 'multiple_correct_answer') {
                  mappedField.templateOptions.label = 'Allow Multiple Selections';
                  mappedField.defaultValue = false;
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                }
              } else if (act.activity_type === this.at.poll) {
                if (mapSource.internal_type === 'PollActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.internal_type === 'MCQChoiceSerializer') {
                  mappedField.type = 'pollChoice';
                } else if (mapSource.internal_type === 'MCQQuestionSerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.internal_type === 'TitleComponentSerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'question_seconds') {
                  mappedField.templateOptions.label = 'Timer to answer';
                  mappedField.type = 'seconds';
                } else if (mapSource.field_name === 'title') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 'Question';
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
                  mappedField.defaultValue = true;
                  mappedField.templateOptions.label = 'Auto forward after results';
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 0;
                } else if (mapSource.field_name === 'show_distribution') {
                  mappedField.templateOptions.label = 'Graph of participant answers';
                  mappedField.templateOptions.description =
                    'If you want to see how people answered then make sure this option is selected.' +
                    ' If you want a poll question, you can create a question without any correct ' +
                    ' answers and then select this option.';
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.hide = true;
                  mappedField.defaultValue = false;
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                }
              } else if (act.activity_type === this.at.title) {
                // for TitleActivity
                if (mapSource.internal_type === 'TitleActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'main_title') {
                  mappedField.templateOptions.label = 'Header';
                  mappedField.templateOptions.placeholder = 'Header text';
                  mappedField.templateOptions.maxLength = 40;
                } else if (mapSource.field_name === 'title_text') {
                  mappedField.type = 'textarea';
                  mappedField.templateOptions.label = 'Subheader';
                  mappedField.templateOptions.placeholder = 'Paragraph text';
                } else if (mapSource.field_name === 'title_image') {
                  mappedField.type = 'layoutImagePicker';
                  mappedField.templateOptions.label = 'Media';
                } else if (mapSource.field_name === 'title_emoji') {
                  mappedField.templateOptions.label = 'Title Icon';
                } else if (mapSource.field_name === 'layout') {
                  mappedField.type = 'layoutPicker';
                  mappedField.templateOptions.label = 'Layout';
                  mappedField.defaultValue = 'icon-center';
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.type = 'seconds';
                  mappedField.hide = true;
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
                  mappedField.templateOptions.maxLength = 100;
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
                  mappedField.hide = true;
                  // mappedField.type = 'seconds';
                  mappedField.defaultValue = 10000;
                  // mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  // mappedField.templateOptions.label = '';
                  // mappedField.templateOptions['hideLabel'] = true;
                  // mappedField.templateOptions['labelForCheckbox'] = 'Add Voting Stage';
                  // mappedField.templateOptions['helpText'] = 'How long does the voting stage last?';
                } else if (mapSource.field_name === 'max_participant_votes') {
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  // mappedField.templateOptions.label = 'Max Participant Votes';
                  // mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['helpText'] = 'Max Participant Votes';
                  mappedField.templateOptions['labelForCheckbox'] = 'Add Voting Stage';
                  // mappedField.hideExpression = '!model.voting_seconds';
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 0;
                  mappedField.type = 'seconds';
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add Winner screen';
                  mappedField.templateOptions['helpText'] = 'How long does the winner stage last?';
                } else if (mapSource.field_name === 'submission_seconds') {
                  mappedField.hide = true;
                  mappedField.type = 'seconds';
                  mappedField.defaultValue = 10000;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.templateOptions['helpText'] = 'How long does the submission stage last?';
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                  mappedField.defaultValue = false;
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.hide = true;
                  mappedField.defaultValue = true;
                }
              } else if (act.activity_type === this.at.video) {
                if (mapSource.internal_type === 'VideoActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'video_url') {
                  delete mappedField.templateOptions.maxLength;
                  mappedField.templateOptions['helpText'] = 'Add youtube or vimeo url';
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                }
              } else if (act.activity_type === this.at.caseStudy) {
                if (mapSource.internal_type === 'CaseStudyActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.internal_type === 'CaseStudyQuestionSerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'title_emoji') {
                  mappedField.templateOptions.label = 'Icon';
                  mappedField.defaultValue = 'emoji://1F4dd';
                } else if (mapSource.field_name === 'activity_title') {
                  mappedField.defaultValue = `Work sheet title`;
                } else if (mapSource.field_name === 'participant_instructions') {
                  mappedField.type = 'textarea';
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'case_study_details') {
                  mappedField.templateOptions.label = 'Instructions';
                  mappedField.type = 'textarea';
                  mappedField.defaultValue = 'work sheet details';
                } else if (mapSource.field_name === 'note_taker_instructions') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'default_data') {
                  mappedField.type = 'textEditor';
                  mappedField.templateOptions.label = 'Worksheet contents';
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'casestudyquestion_set') {
                  mappedField.templateOptions.label = 'Work Areas';
                  mappedField.templateOptions['hideArrayLabel'] = true;
                  mappedField.wrappers = ['benji-field-wrapper'];
                  mappedField.templateOptions['helpText'] =
                    'Work areas are where your participants can collaboratively answer questions.';
                } else if (mapSource.field_name === 'default_editor_content') {
                  mappedField.type = 'textEditor';
                } else if (mapSource.field_name === 'order') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'question_text') {
                  mappedField.templateOptions.label = '';
                  mappedField.className = 'mb-8';
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'grouping_activity_id') {
                  mappedField.hide = true;
                  mappedField.type = 'boolean';
                  mappedField.defaultValue = true;
                  // TODO check if it comes with a model value and process
                  if (content && content.grouping_activity_id) {
                  }
                  mappedField.templateOptions.label = 'Breakout Room Activity';
                  mappedField.templateOptions['hideRequiredMarker'] = true;
                  delete mappedField.templateOptions.required;
                  delete mappedField.templateOptions.maxLength;
                  delete mappedField.templateOptions.minLength;
                } else if (mapSource.field_name === 'mainscreen_instructions') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'activity_seconds') {
                  mappedField.hide = true;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.type = 'seconds';
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.defaultValue = true;
                  mappedField.hide = true;
                }
              } else if (act.activity_type === this.at.feedback) {
                if (mapSource.internal_type === 'FeedbackActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'title_emoji') {
                  mappedField.templateOptions.label = 'Icon';
                  mappedField.defaultValue = 'emoji://1F4cf';
                } else if (mapSource.field_name === 'title_image') {
                  mappedField.hide = true;
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
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                  mappedField.type = 'seconds';
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.templateOptions['helpText'] =
                    'How long does the feedback submission stage last?';
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.defaultValue = false;
                  mappedField.hide = true;
                  mappedField.templateOptions.label = 'Auto Forward';
                  mappedField.templateOptions.description =
                    'If you want the activity to move to the next activity' +
                    ' once everyone has submitted their answers, click auto-forward';
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
                  mappedField.templateOptions.description =
                    'If you have a group with more people than the number of roles' +
                    ' created we will assign the role that can be duplicated to the group with extra people';
                } else if (mapSource.field_name === 'is_non_interactive') {
                  mappedField.templateOptions.label = 'Is this role an observer';
                  mappedField.defaultValue = true;
                } else if (mapSource.field_name === 'feedbackquestions') {
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['addLabel'] = 'Add Feedback Questions';
                } else if (mapSource.internal_type === 'FeedbackQuestionSerializer') {
                  mappedField.templateOptions.label = '';
                  mappedField.type = 'feedbackQuestion';
                } else if (mapSource.field_name === 'grouping_activity_id') {
                  mappedField.type = 'boolean';
                  mappedField.templateOptions.label = 'Breakout Room Activity';
                  mappedField.defaultValue = true;
                  mappedField.templateOptions['hideRequiredMarker'] = true;
                  delete mappedField.templateOptions.required;
                  delete mappedField.templateOptions.maxLength;
                  delete mappedField.templateOptions.minLength;
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.hide = true;
                  mappedField.defaultValue = true;
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                  mappedField.defaultValue = false;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'feedback_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'activity_seconds') {
                  mappedField.type = 'seconds';
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['labelForCheckbox'] = 'Add Activity Seconds';
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === '') {
                  mappedField.templateOptions.label = '';
                }
              } else if (act.activity_type === this.at.buildAPitch) {
                if (mapSource.internal_type === 'BuildAPitchActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'title_emoji') {
                  mappedField.defaultValue = 'emoji://1F3D7-FE0F';
                } else if (mapSource.field_name === 'instructions') {
                  mappedField.type = 'textarea';
                  mappedField.templateOptions.label = 'Instructions';
                  mappedField.templateOptions.placeholder = 'Fill in the sheet to complete your statement';
                  mappedField.templateOptions['helpText'] = 'Instructions to be shown to people.';
                } else if (mapSource.field_name === 'buildapitchblank_set') {
                  mappedField.templateOptions.label = 'Build your madlib';
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'vote_seconds') {
                  mappedField.hide = true;
                  mappedField.type = 'seconds';
                  mappedField.defaultValue = 10000;
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add Voting Stage';
                  mappedField.templateOptions['helpText'] = 'How long does the voting stage last?';
                } else if (mapSource.field_name === 'build_seconds') {
                  mappedField.hide = true;
                  mappedField.templateOptions.label = 'Time to complete Madlib';
                  mappedField.type = 'seconds';
                  // mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'sharing_done') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'voting_done') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'building_done') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 0;
                  // mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  // mappedField.templateOptions.label = '';
                  // mappedField.templateOptions['hideLabel'] = true;
                  // mappedField.templateOptions['labelForCheckbox'] = 'Add Winner Stage';
                  // mappedField.templateOptions['helpText'] = 'How long should the winner be displayed?';
                } else if (mapSource.field_name === 'buildapitchblank_set') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.internal_type === 'BuildAPitchBlankSerializer') {
                  // mappedField.type = 'bapBlank';
                  // mappedField.type = 'bapTextEditor';
                  // mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'blanks_string') {
                  mappedField.type = 'bapTextEditor';
                  mappedField.templateOptions['helpText'] =
                    'Underline text that you want to be a fillable blank';
                  mappedField.templateOptions.label = 'Build your madlib';
                  mappedField.defaultValue =
                    '{"type":"doc","content":[{"type":"paragraph","attrs":{"align":null},"content":[{"type":"text","text":"I can’t believe it’s not "},{"type":"text","marks":[{"type":"u"}],"text":"insert food here."}]}]}';
                } else if (mapSource.field_name === 'help_text') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.hide = true;
                  mappedField.defaultValue = true;
                }
              } else if (act.activity_type === this.at.whereDoYouStand) {
                if (mapSource.internal_type === 'WhereDoYouStandActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'question_title') {
                  mappedField.templateOptions.label = 'Title';
                  mappedField.templateOptions.maxLength = 35;
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                  mappedField.defaultValue = false;
                } else if (mapSource.field_name === 'left_choice') {
                  mappedField.templateOptions.label = 'Choice 1';
                } else if (mapSource.field_name === 'choice_img_url') {
                  mappedField.type = 'emoji';
                } else if (mapSource.field_name === 'right_choice') {
                  mappedField.templateOptions.label = 'Choice 2';
                } else if (mapSource.field_name === 'choice_name') {
                  // mappedField.hide = true;
                } else if (mapSource.field_name === 'collective_name') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'prediction_text') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'preference_text') {
                  // mappedField.templateOptions.label = 'ff';
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'stand_on_side_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'prediction_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.templateOptions.label = 'Time to answer questions';
                  mappedField.type = 'seconds';
                  mappedField.defaultValue = 10000;
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'preference_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                } else if (mapSource.field_name === '') {
                } else if (mapSource.field_name === '') {
                } else if (mapSource.field_name === '') {
                } else if (mapSource.field_name === '') {
                } else if (mapSource.field_name === '') {
                } else {
                }
              } else if (act.activity_type === this.at.convoCards) {
                if (mapSource.internal_type === 'ConvoActivitySerializer') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'main_title') {
                  mappedField.hide = false;
                  mappedField.templateOptions.required = false;
                  mappedField.templateOptions.label = 'Title';
                  mappedField.defaultValue = 'Conversation Cards';
                } else if (mapSource.field_name === 'title_text') {
                  mappedField.hide = false;
                  mappedField.templateOptions.required = false;
                  mappedField.templateOptions.label = 'Instructions';
                  mappedField.defaultValue = 'Instructions to be provided by the instructor.';
                } else if (mapSource.field_name === 'deal_number') {
                  mappedField.templateOptions.label = 'Cards per Participant';
                } else if (mapSource.field_name === 'title_image') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'auto_next') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'cards') {
                  mappedField.type = 'accordion';
                  mappedField.templateOptions.label = 'Cards';
                  mappedField.templateOptions['addLabel'] = 'Add Card';
                } else if (mapSource.internal_type === 'ConvoCardSerializer') {
                  mappedField.templateOptions.label = '';
                  mappedField.type = 'convoCard';
                } else if (mapSource.field_name === 'title_text') {
                  mappedField.templateOptions.label = '';
                } else if (mapSource.field_name === 'hide_timer') {
                  mappedField.hide = true;
                } else if (mapSource.field_name === 'next_activity_delay_seconds') {
                  mappedField.hide = true;
                  mappedField.defaultValue = 10000;
                  mappedField.type = 'seconds';
                  mappedField.wrappers = ['benji-reveal-field-wrapper'];
                  mappedField.templateOptions.label = '';
                  mappedField.templateOptions['hideLabel'] = true;
                  mappedField.templateOptions['labelForCheckbox'] = 'Add timer';
                  mappedField.templateOptions['helpText'] =
                    'How long does the feedback submission stage last?';
                }
              }
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
        if (b.next_activity_delay_seconds === 10000) {
          b.hide_timer = true;
          b.next_activity_delay_seconds = 10000;
        } else {
          b.hide_timer = false;
        }
        b.activity_overview_text = ActivityTitles[this.at.title];
      } else if (b.activity_type === this.at.mcq) {
        if (!b.auto_next) {
          b.next_activity_delay_seconds = 10000;
        }
        if (b.quiz_label) {
          b.quiz_label = 'leader_board';
        } else {
          delete b.quiz_label;
        }

        let multiple_correct_answer = false;
        if (b.question && b.question.mcqchoice_set) {
          const choices = b.question.mcqchoice_set;
          let correct_count = 0;
          choices.forEach((element) => {
            if (element.is_correct) {
              correct_count = correct_count + 1;
            }
          });
          if (correct_count > 1) {
            multiple_correct_answer = true;
          }
        }
        b.multiple_correct_answer = multiple_correct_answer;

        b.activity_overview_text = ActivityTitles[this.at.mcq];
      } else if (b.activity_type === this.at.caseStudy) {
        if (b.grouping_activity_id) {
          // add ExternalGroupingActivity in the effects
          b['grouping_activity_type'] = 'ExternalGroupingActivity';
        } else {
          // add SingleGroupingActivity in the effects
          b['grouping_activity_type'] = 'SingleGroupingActivity';
        }
        if (b.activity_seconds === 10000) {
          b.hide_timer = true;
        }
        b.casestudyquestion_set.forEach((element, i) => {
          if (element) {
            element['order'] = i;
          }
        });
        b.activity_overview_text = ActivityTitles[this.at.caseStudy];
      } else if (b.activity_type === this.at.feedback) {
        b.titlecomponent.participant_instructions = b.titlecomponent.screen_instructions;
        b.activity_overview_text = ActivityTitles[this.at.feedback];
      } else if (b.activity_type === this.at.brainStorm) {
        b.brainstormcategory_set = b.brainstormcategory_set.filter(
          (obj) => obj && obj.category_name && obj.category_name.length !== 0
        );
        if (b.brainstormcategory_set.length > 0) {
          b.categorize_flag = true;
        } else {
          b.categorize_flag = false;
        }

        if (b.submission_seconds === 10000) {
          b.hide_timer = true;
        } else {
          // show timer when user changes the submission seconds
          b.hide_timer = false;
        }
        b.activity_overview_text = ActivityTitles[this.at.brainStorm];
      } else if (b.activity_type === this.at.genericRoleplay) {
        b.instructions = b.short_instructions;
        if (b.grouping_activity_id) {
          // add ExternalGroupingActivity in the effects
          b['grouping_activity_type'] = 'ExternalGroupingActivity';
        } else {
          // add SingleGroupingActivity in the effects
          b['grouping_activity_type'] = 'SingleGroupingActivity';
        }
      } else if (b.activity_type === this.at.buildAPitch) {
        // buildapitchblank_set: [{label: "ffegg", temp_text: "eett", order: 1},
        // {label: "ggge", temp_text: "eee", order: 2}]
        // const oldWay = [
        //   { label: 'ffegg', temp_text: 'eett', order: 1 },
        //   { label: 'ggge', temp_text: 'eee', order: 2 },
        // ];
        // const parsedBlanks = this.buildAPitchService.getBlanks(b.blanks_string);

        // const oldWay2 = [];
        // for (let i = 0; i < parsedBlanks.lenght; i++) {
        //   if (parsedBlanks[i].type === 'label') {
        //     oldWay2 =
        //   }
        // }

        // console.log(oldWay, parsedBlanks);
        if (b.buildapitchblank_set.length) {
          b.buildapitchblank_set.forEach((v, i) => {
            if (v) {
              v['order'] = i + 1;
            }
          });
        }

        // if user has set a voting stage add a winner stage as well
        if (b.vote_seconds !== 0) {
          b.next_activity_delay_seconds = 10000;
        }
        b.activity_overview_text = ActivityTitles[this.at.buildAPitch];
      } else if (b.activity_type === this.at.whereDoYouStand) {
        // if (b.next_activity_delay_seconds) {
        //   b.prediction_seconds = b.next_activity_delay_seconds;
        //   b.preference_seconds = b.next_activity_delay_seconds;
        //   b.stand_on_side_seconds = b.next_activity_delay_seconds;
        // }
        // if (b.left_choice.preference_text) {
        //   b.left_choice.choice_name = b.left_choice.preference_text.replace(/\s/g, '');
        //   b.left_choice.collective_name = b.left_choice.preference_text;
        // }
        // if (b.right_choice.preference_text) {
        //   b.right_choice.choice_name = b.right_choice.preference_text.replace(/\s/g, '');
        //   b.right_choice.collective_name = b.right_choice.preference_text;
        // }
        b.left_choice.collective_name = 'x';
        b.left_choice.prediction_text = 'x';
        b.left_choice.preference_text = 'x';
        b.right_choice.collective_name = 'x';
        b.right_choice.prediction_text = 'x';
        b.right_choice.preference_text = 'x';

        b.prediction_text = 'x';
        b.preference_text = 'x';
        b.activity_overview_text = ActivityTitles[this.at.whereDoYouStand];
      } else if (b.activity_type === this.at.convoCards) {
        b.activity_overview_text = ActivityTitles[this.at.convoCards];
      } else if (b.activity_type === this.at.poll) {
        b.activity_overview_text = ActivityTitles[this.at.poll];
        if (b.quiz_label) {
          b.quiz_label = 'leader_board';
        } else {
          delete b.quiz_label;
        }
      } else if (b.activity_type === this.at.video) {
        b.activity_overview_text = 'x';
      }
      this.store.dispatch(new fromStore.AddActivityContent(b));
    });
  }

  saveValues($event) {}

  ngOnDestroy() {
    // console.log('destroy called');
    // this.store.dispatch(new fromStore.ResetStore());
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
  BuildAPitchActivity: true,
  FeedbackActivity: true,
  GenericRoleplayActivity: true,
  ConvoActivity: true,
  CaseStudyActivity: true,
  WhereDoYouStandActivity: true,
};

export const OrderForActivities = {
  TitleActivity: ['title_emoji', 'main_title', 'title_text', 'title_image', 'layout'],
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
  MCQActivity: ['titlecomponent', 'title', 'question', 'question_seconds', 'mcqchoice_set', 'quiz_label'],
  VideoActivity: ['video_url', 'auto_next', 'next_activity_delay_seconds'],
  CaseStudyActivity: [
    'title_emoji',
    'activity_title',
    'participant_instructions',
    'note_taker_instructions',
    'case_study_details',
    'default_data',
    'casestudyquestion_set',
  ],
  FeedbackActivity: [
    'title_emoji',
    'titlecomponent',
    'main_title',
    'title_text',
    'feedbackquestion_set',
    'next_activity_delay_seconds',
    'auto_next',
  ],
  GenericRoleplayActivity: ['genericroleplayrole_set', 'name', 'image_url', 'instructions'],
  BuildAPitchActivity: [
    'title_emoji',
    'title',
    'instructions',
    'buildapitchblank_set',
    'build_seconds',
    'vote_seconds',
  ],
  WhereDoYouStandActivity: [
    'question_title',
    'left_choice',
    'right_choice',
    'choice_img_url',
    'prediction_seconds',
  ],
  ConvoActivity: ['main_title', 'title_text', 'convocard_set'],
  PollActivity: ['titlecomponent', 'title', 'question', 'mcqchoice_set', 'question_seconds', 'quiz_label'],
};
