// TODO; figure me out, I'm not being used anywhere

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-feedback-prompt',
  templateUrl: './feedback-prompt.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class FeedbackPromptComponent implements OnInit {
  @Input() prompt;
  @Output() value = new EventEmitter();

  textVal;

  constructor() {}

  ngOnInit() {
    this.value.emit('Neutral');
  }

  changed_rating(val) {
    this.value.emit(val);
  }

  changed_text() {
    this.value.emit(this.textVal);
  }
}
