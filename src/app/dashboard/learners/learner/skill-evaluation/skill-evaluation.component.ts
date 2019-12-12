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
        // this.statsData = res[0];
        console.log(res);

        // pitching: 3 sessions 4 people in each session answering 3 questions
        // [[4, 3, 5], [4, 4, 4], [3, 4, 5]]
        // and he self assessed [3, 3, 3] star for compelling pitch
        // ((4 * 0.22) + (3 * 0.22) + (5 * 0.22) + (3 * 0.11)  + (4 * 0.11) + (5* 0.11))
        // compelling, essential questions, overall execellent
        // 1st session pom feedback: [1,1,1]
        // 2nd session pom feedback: [2,2,2]
        // 3rd session pom feedback: [3,3,3]
        // 4th session pom feedback: [4,4,4]

        // 1st session self feedback: [1,1,1]
        // 2nd session self feedback: [2,2,2]
        // 3rd session self feedback: [3,3,3]
        // 4th session self feedback: [4,4,4]

        const compellingMultiplier = 0.22;
        const selfMultiplier = 0.11;
        // Compelling feedback across all four sessions
        // [compellingSession1Score, compellingSession2Score, compellingSession3Score, CompellingSession4Score]
        const compellingFeedback = [1, 2, 3, 4];
        // Selffeedback on each session
        const selfFeedback = [
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4],
          [1, 2, 3, 4]
        ];

        compellingFeedback.forEach((rating, i) => {
          const weightedScore = rating * compellingMultiplier;
          selfFeedback[i].forEach(selfrating => {
            const selfweighted = selfrating * selfMultiplier;
          });
        });

        // what data should look like
        // [x, x+y, x+y+z]
        const skillOverFactory = this.componentFactoryResolver.resolveComponentFactory(
          SkillOverviewComponent
        );
        const component = this.entry.createComponent(skillOverFactory);
        component.instance.overviewData = overviewData;

        const component2 = this.entry2.createComponent(skillOverFactory);
        component2.instance.overviewData = overviewData2;

        const component3 = this.entry3.createComponent(skillOverFactory);
        component3.instance.overviewData = overviewData3;

        const component4 = this.entry4.createComponent(skillOverFactory);
        component4.instance.overviewData = overviewData4;
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

const overviewData = {
  title: 'Pitching',
  donut: {
    title: 'Pitch Skill',
    data: 70,
    color: '#0a4cef'
  }
};

const overviewData2 = {
  title: 'Objection Handling',
  donut: {
    title: 'Pitch Skill',
    data: 70,
    color: '#0a4cef'
  }
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
