import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as Chart from 'chart.js';
import { switchMap } from 'rxjs/operators';
import { ActivityTypes } from 'src/app/globals';
import { feedback } from '../services/feedback';
import { mcqsData } from '../services/mcqs';
import { PastSessionsService } from '../services/past-sessions.service';
import { pom } from '../services/pom';
import { BuildAPitchComponent } from './build-a-pitch/build-a-pitch.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { McqsComponent } from './mcqs/mcqs.component';
import { PitchOMaticComponent } from './pitch-o-matic/pitch-o-matic.component';

@Component({
  selector: 'benji-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterContentInit {
  // canvas: any;
  // ctx: CanvasRenderingContext2D;
  // data: any;
  // myChart: any;
  // mcqs = {};
  // assessments = [];
  @ViewChild('reportEntry', { read: ViewContainerRef }) entry: ViewContainerRef;

  statsData: any;
  fbData: any;
  pom: any;

  // @ViewChild('chartCanvas') chartCanvas: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private pastSessionsService: PastSessionsService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    // this.pastSessionsService.getReports('8269').subscribe(res => {
    //   // console.log(res.mcqs[0]);
    //   this.mcqs = mcqsData;
    //   console.log(res);
    //   console.log(mcqsData);
    //   // this.statsData = res;
    //   this.statsData = feedback;
    //   this.fbData = feedback;
    //   this.pom = pom;
    //   // res.assessments.forEach(fback => {
    //   //   let avg = 0;
    //   //   const noOfQuestions = fback.feedbackquestion_set.length;
    //   //   fback.feedbackquestion_set.forEach(question => {
    //   //     avg = avg + parseFloat(question.average_rating);
    //   //   });
    //   //   avg = avg / noOfQuestions;
    //   //   this.assessments.push(Math.round(avg * 100) / 100);
    //   // });
    //   // console.log(this.assessments);
    //   // this.myChart.chart.update();
    // });
  }

  ngAfterContentInit() {
    // 73929 pitch perfect
    // 99521 active listening
    this.pastSessionsService.getReports('8269').subscribe(res => {
      console.log(res);
      // this.statsData = res;
      this.statsData = res[0];

      // this.fbData = feedback;
      // this.pom = pom;

      // Iterate over each item in array
      res.forEach(act => {
        if (act.activity_type === ActivityTypes.mcq) {
          const mcqComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
            McqsComponent
          );
          const component = this.entry.createComponent(mcqComponentFactory);
          component.instance.data = act;
        } else if (act.activity_type === ActivityTypes.feedback) {
          const feedbackComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
            FeedbackComponent
          );
          const component = this.entry.createComponent(
            feedbackComponentFactory
          );
          component.instance.data = act;
        } else if (act.activity_type === ActivityTypes.pitchoMatic) {
          const pomComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
            PitchOMaticComponent
          );
          const component = this.entry.createComponent(pomComponentFactory);
          component.instance.data = act;
        } else if (act.activity_type === ActivityTypes.buildAPitch) {
          const bapComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
            BuildAPitchComponent
          );
          const component = this.entry.createComponent(bapComponentFactory);
          component.instance.data = act;
        }
      });
    });
  }
}
