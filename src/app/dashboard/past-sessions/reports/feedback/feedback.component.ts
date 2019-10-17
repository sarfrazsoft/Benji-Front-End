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
export class FeedbackComponent implements OnInit, OnChanges {
  @Input() data: any;

  fback;
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.data.activity_results) {
      this.fback = this.data.activity_results[0].feedbackquestion_set;
    }
  }
}
