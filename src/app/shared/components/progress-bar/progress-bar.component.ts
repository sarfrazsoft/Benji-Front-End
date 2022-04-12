import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'benji-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressbarComponent implements OnInit {
  @Input() percent;
  percentage: number;

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges(){
    this.percentage = Math.round(this.percent);
  }
  
}
