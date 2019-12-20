import { Component, Input, OnInit } from '@angular/core';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-option-distribution-bars',
  templateUrl: './option-distribution-bars.component.html',
  styleUrls: ['./option-distribution-bars.component.scss']
})
export class OptionDistributionBarsComponent implements OnInit {
  @Input() mcqs: ActivityReport;
  constructor() {}

  ngOnInit() {}
}
