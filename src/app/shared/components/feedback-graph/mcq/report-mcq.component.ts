import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ImageSelectorComponent } from 'src/app/dashboard/editor/services';
import { PastSessionsService } from 'src/app/services';
import { FeedbackGraphQuestion, User } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-report-mcq',
  templateUrl: './report-mcq.component.html',
})
export class ReportMCQComponent implements OnInit, AfterViewInit {
  @Input() question: FeedbackGraphQuestion | any;
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.updateChart();
    });

    console.log(this.question);
  }

  updateChart() {}

  ngAfterViewInit() {}
}
