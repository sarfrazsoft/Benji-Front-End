import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-option-distribution-bars',
  templateUrl: './option-distribution-bars.component.html',
  styleUrls: ['./option-distribution-bars.component.scss']
})
export class OptionDistributionBarsComponent implements OnInit {
  @Input() mcqs: any;
  constructor() {}

  ngOnInit() {}
}
