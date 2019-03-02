import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-participant-feedback-activity',
  templateUrl: './participant-feedback-activity.component.html',
  styleUrls: ['./participant-feedback-activity.component.scss']
})
export class ParticipantFeedbackActivityComponent extends BaseActivityComponent
  implements OnInit {
  form: FormGroup;
  feedbackSubmitted: boolean;

  constructor(private builder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.builder.group({
      usefulSession: '',
      usefulSessionComment: '',
      funSession: '',
      funSessionComments: '',
      otherComments: ''
    });
  }

  submitFeedback() {
    console.log(this.form.value);
    this.feedbackSubmitted = true;
  }
}
