import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'benji-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() data: any = {};

  fback;
  constructor() {}

  ngOnInit() {
    if (this.data && this.data.feedback) {
      this.fback = this.data.feedback.feedbackquestion_set;
    }
  }

  // ngOnChanges() {
  //   if (this.data && this.data.feedback) {
  //     this.fback = this.data.feedback.feedbackquestion_set;
  //   }
  // }
}
