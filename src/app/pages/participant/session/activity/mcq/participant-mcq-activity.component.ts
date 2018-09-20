import {Component, OnInit, ViewEncapsulation, OnDestroy, OnChanges, SimpleChanges, Input} from '@angular/core';
import { BaseActivityComponent } from '../../../../shared/base-activity.component';
import {BackendService} from '../../../../../services/backend.service';

@Component({
  selector: 'app-participant-activity-mcq',
  templateUrl: './participant-mcq-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileMCQActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  @Input() joinedUsers;
  answer;
  selected;
  isCorrect;
  noAnswer;

  constructor(private backend: BackendService) { super(); }

  ngOnInit() {
    setTimeout(() => this.showAnswerMode(), (this.activityDetails.mcqactivity.timer) * 1000);
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    const completed = this.activityRun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.find(y => y.param_name === 'answer') !== undefined).length;
    const total = this.activityRun.activityrunuser_set.length;

    if (completed >= this.joinedUsers.length && !this.answer) {
      this.showAnswerMode();
    }
  }

  showAnswerMode() {
    if (!this.selected) {
      this.noAnswer = true;
      this.answer = this.activityDetails.mcqactivity.mcqanswers_set.find(x => x.is_correct);
    } else {
      this.answer = this.selected;
    }
  }

  numToLetter(num) {
    return 'ABCDEFGHIJK'.charAt(num - 1);
  }

  submitAnswer(ans) {
    if (!this.selected) {
      this.selected = ans;
      this.isCorrect = ans.is_correct;
      this.backend.set_activity_user_parameter(this.activityRun.id, 'answer', ans.id).subscribe();
    }
  }

  getClass(q) {
    if (this.selected && this.selected.id === q.id) {
      return 'w-button selected-button';
    } else {
      return 'w-button question-button';
    }
  }


}
