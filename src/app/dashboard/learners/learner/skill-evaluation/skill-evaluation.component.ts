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
import { ActivatedRoute } from '@angular/router';
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
  learnerID = '';
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
    private pastSessionsService: PastSessionsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.learnerID = paramMap.get('learnerID');
    });
  }

  ngOnInit() {
    this.pastSessionsService
      .getAllReports()
      .subscribe((res: Array<ActivityReport>) => {
        console.log(res);

        const selfFeedbacks = [];
        const peerFeedbacks = [];
        const mcqsScores = [];

        res.forEach(result => {
          // populate selfFeedbacks
          selfFeedbacks.push([]);
          result.postAssessment.feedbackquestion_set.forEach(question => {
            question.feedbackuseranswer_set.forEach(answer => {
              if (answer.user.id === parseInt(this.learnerID, 10)) {
                selfFeedbacks[selfFeedbacks.length - 1].push(
                  answer.rating_answer
                );
              }
            });
          });

          // populate peerfeedbacks for pom
          peerFeedbacks.push([]);
          result.pom.feedbackquestion_set.forEach(question => {
            const userFeedback = result.pom.pitchomaticgroupmembers.find(
              member => member.user.id === parseInt(this.learnerID, 10)
            );

            const ratings = [];
            const questionFeedback = userFeedback.pitchomaticfeedback_set.forEach(
              fb => {
                if (fb.feedbackquestion === question.id) {
                  ratings.push(fb.rating_answer);
                }
              }
            );

            peerFeedbacks[peerFeedbacks.length - 1].push(ratings);
          });

          // formulate mcq scores
          mcqsScores.push([]);
          result.mcqs.forEach(mcq => {
            const correctChoices = mcq.question.mcqchoice_set.filter(
              choice => choice.is_correct
            );
            const userAnswer = mcq.mcqactivityuseranswer_set.find(
              answer => answer.user.id === parseInt(this.learnerID, 10)
            );
            if (
              userAnswer &&
              correctChoices.find(choice => choice.id === userAnswer.answer)
            ) {
              mcqsScores[mcqsScores.length - 1].push(1);
            } else {
              mcqsScores[mcqsScores.length - 1].push(0);
            }
          });
        });

        console.log(mcqsScores);

        // MCQ

        // Pitching Skill

        const peerfbackMultiplier = 0.22;
        const selfFbackMultiplier = 0.11;
        //  PeerFeedbacks[
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
        // peerFeedbacks = [
        //   [
        //     [3, 4, 2, 2],
        //     [4, 2, 4, 2],
        //     [1, 2, 2, 2]
        //   ],
        //   [
        //     [1, 2, 4, 5],
        //     [4, 5, 2, 1],
        //     [5, 4, 5, 3]
        //   ],
        //   [
        //     [4, 4, 1, 1],
        //     [4, 5, 4, 1],
        //     [1, 1, 1, 1]
        //   ]
        // ];

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

        // Calculate mcq scores
        mcqsScores.forEach((sessionScore, sessionIndex) => {
          const sum = sessionScore.reduce((a, b) => a + b, 0);
          const avg = sum / sessionScore.length || 0;
          overviewData3.chart.sessionInfo[sessionIndex].value = sum;
          overviewData3.donut.data =
            overviewData3.donut.data + sum / mcqsScores.length;
          overviewData3.donut.data =
            Math.round(overviewData3.donut.data * 10) / 10;
        });
        overviewData3.donut.data =
          (overviewData3.donut.data / mcqsScores[0].length) * 100;

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

        const component5 = this.entry4.createComponent(skillOverFactory);
        component5.instance.overviewData = overviewData3;
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
    data: 20,
    color: '#00178a'
  },
  chart: {
    label: 'Sessions',
    sessionInfo: [
      {
        date: '2nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/02',
        value: 0
      },
      {
        date: '14th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/14',
        value: 0
      },
      {
        date: '12th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/12',
        value: 0
      }
    ]
  },
  enoughData: true
};
const overviewData2 = {
  title: 'Rapport',
  donut: {
    title: 'Pitch Skill',
    data: 30,
    color: '#fcfcfc'
  },
  chart: {
    label: 'Sessions',
    sessionInfo: [
      {
        date: '2nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/02',
        value: 0
      },
      {
        date: '14th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/14',
        value: 0
      },
      {
        date: '12th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/12',
        value: 0
      }
    ]
  },
  enoughData: true
};

const overviewData3 = {
  title: 'MCQs',
  donut: {
    title: 'MCQs',
    data: 0,
    color: '#000'
  },
  chart: {
    label: 'Sessions',
    sessionInfo: [
      {
        date: '2nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/02',
        value: 0
      },
      {
        date: '14th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/14',
        value: 0
      },
      {
        date: '12th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/12',
        value: 0
      }
    ]
  },
  enoughData: true
};
