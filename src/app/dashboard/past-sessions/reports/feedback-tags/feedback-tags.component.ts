import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-feedback-tags',
  templateUrl: './feedback-tags.component.html',
  styleUrls: ['./feedback-tags.component.scss']
})
export class FeedbackTagsComponent implements OnInit {
  @Input() data = [];
  constructor() {}

  ngOnInit() {
    // console.log(this.data);
  }
}
