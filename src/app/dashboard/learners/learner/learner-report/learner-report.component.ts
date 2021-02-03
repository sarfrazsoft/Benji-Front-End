import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearnerService } from 'src/app/dashboard/learners/services';
import { ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { PastSessionsService } from 'src/app/services';
import {
  ActivityReport,
  FeedbackGraphQuestion,
  PitchoMaticBlank,
  PitchoMaticGroupMember,
} from 'src/app/services/backend/schema';
import { PitchOMaticComponent as LearnerPitchOMaticComponent } from './pitch-o-matic/pitch-o-matic.component';

@Component({
  selector: 'benji-learner-report',
  templateUrl: './learner-report.component.html',
  styleUrls: ['./learner-report.component.scss'],
})
export class LearnerReportComponent implements OnInit {
  @ViewChild('reportEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  // fback: any = feedback.feedback.feedbackquestion_set;
  pitchText = '';
  userId = 2;
  arr: Array<FeedbackGraphQuestion> = [];
  dataExists = true;
  constructor(
    private learnerService: LearnerService,
    private contextService: ContextService,
    private activatedRoute: ActivatedRoute,
    private pastSessionsService: PastSessionsService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.activatedRoute.data.forEach((data: any) => {
      // this.userId = data.dashData.user.id;
    });
  }

  ngOnInit() {
    // this.userId = this.contextService.user;
    // this.pitchText = this.getUserPitchPrompt();
    // this.formatData();
    this.pastSessionsService.getReports('65367').subscribe((res: Array<ActivityReport>) => {
      // Iterate over each item in array
      res.forEach((act: ActivityReport) => {
        if (act.activity_type === ActivityTypes.pitchoMatic) {
          const pomComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
            LearnerPitchOMaticComponent
          );
          const component = this.entry.createComponent(pomComponentFactory);
          component.instance.data = act;
        }
      });
    });
  }
}
