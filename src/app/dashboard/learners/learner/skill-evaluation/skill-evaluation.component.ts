import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import * as Chart from 'chart.js';
import { ActivityTypes } from 'src/app/globals';
import { ActivityReport, FeedbackGraphQuestion } from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';
import { SkillOverviewComponent } from './skill-overview/skill-overview.component';

@Component({
  selector: 'benji-skill-evaluation',
  templateUrl: './skill-evaluation.component.html',
  styleUrls: ['./skill-evaluation.component.scss']
})
export class SkillEvaluationComponent implements OnInit {
  @Input() question: FeedbackGraphQuestion;
  canvas: any;
  ctx: CanvasRenderingContext2D;
  myChart: any;
  @ViewChild('chartCanvas') chartCanvas: ElementRef;

  @ViewChild('reportEntry', { read: ViewContainerRef }) entry: ViewContainerRef;
  @ViewChild('reportEntry2', { read: ViewContainerRef }) entry2: ViewContainerRef;
  @ViewChild('reportEntry3', { read: ViewContainerRef }) entry3: ViewContainerRef;
  @ViewChild('reportEntry4', { read: ViewContainerRef }) entry4: ViewContainerRef;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private pastSessionsService: PastSessionsService, ) { }

  ngOnInit() {
    this.pastSessionsService
      .getReports('65367')
      .subscribe((res: Array<ActivityReport>) => {
        // this.statsData = res[0];
        const skillOverFactory = this.componentFactoryResolver.resolveComponentFactory(
          SkillOverviewComponent
        );
        const component = this.entry.createComponent(skillOverFactory);

        const component2 = this.entry2.createComponent(skillOverFactory);
        const component3 = this.entry3.createComponent(skillOverFactory);
        const component4 = this.entry4.createComponent(skillOverFactory);

        // Iterate over each item in array
        // res.forEach((act: ActivityReport) => {
        // if (act.activity_type === ActivityTypes.mcq) {
        // <benji-skill - overview > </benji-skill-overview>;
        // component.instance.data = act;
        // }
        // });
      });
  }
}

const colors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};
