import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressbarComponent implements OnInit {
  @Input() percent;

  constructor() {}

  ngOnInit() {}
}
