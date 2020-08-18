import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-mcqs',
  templateUrl: './mcqs.component.html',
  styleUrls: ['./mcqs.component.scss']
})
export class McqsComponent implements OnInit {
  @Input() mcqs: any;
  constructor() {}

  ngOnInit() {
    console.log(this.mcqs);
  }
}
