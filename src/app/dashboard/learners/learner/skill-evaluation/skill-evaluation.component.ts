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
import {
  ActivityReport,
  FeedbackGraphQuestion
} from 'src/app/services/backend/schema';
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
  @ViewChild('reportEntry2', { read: ViewContainerRef })
  entry2: ViewContainerRef;
  @ViewChild('reportEntry3', { read: ViewContainerRef })
  entry3: ViewContainerRef;
  @ViewChild('reportEntry4', { read: ViewContainerRef })
  entry4: ViewContainerRef;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private pastSessionsService: PastSessionsService
  ) {}

  ngOnInit() {
    this.pastSessionsService
      .getAllReports()
      .subscribe((res: Array<ActivityReport>) => {
        console.log(res);

        // Pitching Skill

        const peerfbackMultiplier = 0.22;
        const selfFbackMultiplier = 0.11;
        //  PeerFedbacks[
        //    S1[
        //      Q1[r1,r2,r3,r4],
        //      Q2[r1,r2,r3,r4],
        //      Q3[r1,r2,r3,r4]
        //    ]
        //    S2[
        //     Q1[r1,r2,r3,r4],
        //     Q2[r1,r2,r3,r4],
        //     Q3[r1,r2,r3,r4]
        //    ]
        //  ]

        // Self Assessment
        // SelfFeedbacks[
        //   S1[Q1,Q2,Q3],
        //   S2[Q1,Q2,Q3]
        // ]
        const peerFeedbacks = [
          [
            [3, 4, 2, 2],
            [4, 2, 4, 2],
            [1, 2, 2, 2]
          ],
          [
            [1, 2, 4, 5],
            [4, 5, 2, 1],
            [5, 4, 5, 3]
          ],
          [
            [4, 4, 4, 5],
            [4, 5, 4, 1],
            [5, 4, 5, 4]
          ],
          [
            [5, 5, 4, 5],
            [4, 5, 3, 5],
            [5, 4, 5, 5]
          ]
        ];

        const selfFeedbacks = [
          [4, 5, 3],
          [5, 5, 4],
          [5, 3, 4],
          [5, 4, 5]
        ];

        const dataPoints = [];
        peerFeedbacks.forEach((session, sessionIndex) => {
          let sumOfAvgs = 0;
          session.forEach((questionResponses, i) => {
            let sum = 0;
            questionResponses.forEach(response => {
              sum = sum + response * peerfbackMultiplier;
            });
            sumOfAvgs = sumOfAvgs + sum / questionResponses.length;
          });
          let selfFbackSum = 0;
          selfFeedbacks[sessionIndex].forEach(response => {
            selfFbackSum = selfFbackSum + response * selfFbackMultiplier;
          });

          const dataPoint = sumOfAvgs + selfFbackSum;
          overviewData.chart.sessionInfo[sessionIndex].value = dataPoint;
          dataPoints.push(dataPoint);
        });

        const skillOverFactory = this.componentFactoryResolver.resolveComponentFactory(
          SkillOverviewComponent
        );
        const component = this.entry.createComponent(skillOverFactory);
        component.instance.overviewData = overviewData;

        const component2 = this.entry2.createComponent(skillOverFactory);
        component2.instance.overviewData = overviewData2;

        const component3 = this.entry3.createComponent(skillOverFactory);
        component3.instance.overviewData = overviewData;

        const component4 = this.entry4.createComponent(skillOverFactory);
        component4.instance.overviewData = overviewData;
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

const overviewData = {
  title: 'Pitching',
  donut: {
    title: 'Pitch Skill',
    data: 70,
    color: '#0a4cef'
  },
  chart: {
    label: 'Sessions',
    sessionInfo: [
      {
        date: '2nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/02',
        value: 3
      },
      {
        date: '14th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/14',
        value: 5
      },
      {
        date: '12th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/12',
        value: 7
      },
      {
        date: '22nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/22',
        value: 6
      }
    ]
  },
  enoughData: true
};
const overviewData2 = {
  title: 'Pitching',
  donut: {
    title: 'Pitch Skill',
    data: 70,
    color: '#0a4cef'
  },
  chart: {
    label: 'Sessions',
    sessionInfo: [
      {
        date: '2nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/02',
        value: 3
      },
      {
        date: '14th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/14',
        value: 5
      },
      {
        date: '12th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/12',
        value: 7
      },
      {
        date: '22nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/22',
        value: 6
      }
    ]
  },
  enoughData: false
};

const overviewData3 = {
  title: 'Building Rapport',
  donut: {
    title: 'Pitch Skill',
    data: 70,
    color: '#0a4cef'
  }
};

const overviewData4 = {
  title: 'Closing',
  donut: {
    title: 'Pitch Skill',
    data: 70,
    color: '#0a4cef'
  }
};
