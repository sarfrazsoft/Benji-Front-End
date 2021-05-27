import { Component, Input, OnInit } from '@angular/core';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-option-distribution-bars',
  templateUrl: './option-distribution-bars.component.html',
})
export class OptionDistributionBarsComponent implements OnInit {
  @Input() mcqs: ActivityReport;
  constructor() {}

  ngOnInit() {}
}
