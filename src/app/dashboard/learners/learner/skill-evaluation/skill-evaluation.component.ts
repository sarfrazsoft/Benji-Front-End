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
import * as moment from 'moment';
import { ActivityTypes } from 'src/app/globals';
import {
  ActivityReport,
  FeedbackGraphQuestion,
  FeedbackReport,
  PitchOMaticReport,
  SessionReport
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

  pitchingOverview = {
    title: 'Pitching',
    donut: {
      title: 'Pitch Skill',
      data: 10,
      color: '#00178a'
    },
    chart: {
      label: 'Sessions',
      sessionInfo: [
        // {
        //   date: '2nd Jan, 2020',
        //   name: '',
        //   xlabel: '01/02',
        //   value: 0
        // },
        // {
        //   date: '14th Jan, 2020',
        //   name: '',
        //   xlabel: '01/14',
        //   value: 0
        // },
        // {
        //   date: '12th Jan, 2020',
        //   name: '',
        //   xlabel: '01/12',
        //   value: 0
        // }
      ]
    },
    enoughData: false
  };

  mcqOverview = {
    title: 'MCQs',
    donut: {
      title: 'MCQs',
      data: 85,
      color: '#000'
    },
    chart: {
      label: 'Sessions',
      sessionInfo: [
        {
          date: '2nd Jan, 2020',
          name: 'Pitch perfect',
          xlabel: '01/02',
          value: 5
        },
        {
          date: '14th Jan, 2020',
          name: 'Pitch practice',
          xlabel: '01/14',
          value: 7
        },
        {
          date: '12th Jan, 2020',
          name: 'Pitch practice',
          xlabel: '01/12',
          value: 9
        }
      ]
    },
    enoughData: false
  };

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
      this.getLearnerData();
    });
  }

  getLearnerData() {
    this.pastSessionsService
      .getLearnerSessionSummaries(this.learnerID)
      .subscribe((pastSessionsReports: Array<SessionReport>) => {
        this.setupCharts(pastSessionsReports);
      });
  }

  ngOnInit() {}

  // reports = PastSessionsReports
  setupCharts(reports: Array<SessionReport>) {
    // Verify if the particular report needs to be
    // included in the pitching skill widget
    reports = this.verifyData(reports);

    reports = reports.sort((a, b) => a.id - b.id);
    reports = reports.filter(a => a.lesson.lesson_id === 'pitch_perfect_1');
    // Calculating for last 3 sessions only
    // reports = reports.slice(reports.length - 3);

    const arr = [];
    reports.forEach((report, sessionIndex) => {
      this.setupChartsDates(report, sessionIndex);

      const obj = { postAssessment: {}, pom: {}, mcqs: [] };
      // Iterate over each activity in order and
      // push them to the array
      report.activity_results.forEach((act, i) => {
        let title = '';
        for (const key in act) {
          if (act.hasOwnProperty(key)) {
            if (key !== 'base_activity') {
              title = act['base_activity'].description;
              act = act[key];
              act.title = title;
            }
          }
        }

        if (act.activity_type === ActivityTypes.feedback) {
          if (act.title === 'How do you feel about pitching now?') {
            obj.postAssessment = act as FeedbackReport;
          }
        } else if (act.activity_type === ActivityTypes.pitchoMatic) {
          obj.pom = act as PitchOMaticReport;
        } else if (
          act.activity_type === ActivityTypes.mcq &&
          // (act.title === 'weighted_mcq' ||
          //   act.title === 'Pop Quiz Q1' ||
          //   act.title === 'Pop Quiz Q2' ||
          //   act.title === 'Pop Quiz Q3' ||
          //   act.title === 'Pop Quiz Q4' ||
          //   act.title === 'Pop Quiz Q5')
          act.title === 'weighted_mcq'
        ) {
          obj.mcqs.push(act);
        }
      });
      arr.push(obj);
    });

    const selfFeedbacks = [];
    const peerFeedbacks = [];
    const mcqsScores = [];

    arr.forEach(result => {
      // It'll respond with not enough data if POM feedback or selffeedbacks
      // are not available
      this.populatePitchingScores(result, selfFeedbacks, peerFeedbacks);

      // formulate mcq scores
      this.populateMCQScores(result, mcqsScores);
    });

    // Pitching Skill
    const peerfbackMultiplier = 0.22;
    const selfFbackMultiplier = 0.11;
    //  PeerFeedbacks[
    //    S1[
    //      Q1[r1,r2,r3,r4],
    //      Q2[r1,r2,r3,r4,r5],
    //      Q3[r1,r2,r3,r4]
    //    ]
    //    S2[
    //     Q1[r1,r2,r3,r4,r5],
    //     Q2[r1,r2,r3,r4],
    //     Q3[r1,r2,r3]
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

    // selfFeedbacks = [
    //   [3, 3, 1],
    //   [3, 4, 5],
    //   [5, 4, 3]
    // ];

    const dataPoints = [];
    let pitchingAvg = 0;
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
      this.pitchingOverview.chart.sessionInfo[sessionIndex].value =
        dataPoint * 2;
      dataPoints.push(dataPoint * 2);
      pitchingAvg = pitchingAvg + (dataPoint / 5) * 100;
    });
    pitchingAvg = pitchingAvg / peerFeedbacks.length;
    this.pitchingOverview.donut.data = Math.round(pitchingAvg);

    // commented out mcq widget
    // Calculate mcq scores
    // this.calculateMCQScores(mcqsScores);

    this.createWidgetComponents();
  }

  setupChartsDates(report: SessionReport, sessionIndex: number) {
    this.pitchingOverview.chart.sessionInfo.push({
      date: '',
      name: '',
      xlabel: '',
      value: 0
    });
    this.mcqOverview.chart.sessionInfo.push({
      date: '',
      name: '',
      xlabel: '',
      value: 0
    });

    this.pitchingOverview.chart.sessionInfo[sessionIndex].name =
      report.lesson.lesson_name;
    this.mcqOverview.chart.sessionInfo[sessionIndex].name =
      report.lesson.lesson_name;

    this.pitchingOverview.chart.sessionInfo[sessionIndex].date = moment(
      report.start_time
    ).format('MMMM, DD YYYY');
    this.mcqOverview.chart.sessionInfo[sessionIndex].date = moment(
      report.start_time
    ).format('MMMM, DD YYYY');

    this.pitchingOverview.chart.sessionInfo[sessionIndex].xlabel = moment(
      report.start_time
    ).format('MM/DD');
    this.mcqOverview.chart.sessionInfo[sessionIndex].xlabel = moment(
      report.start_time
    ).format('MM/DD');
  }

  populatePitchingScores(result, selfFeedbacks, peerFeedbacks) {
    // populate selfFeedbacks
    selfFeedbacks.push([]);
    this.populateSelfFeedbacks(result, selfFeedbacks);

    // populate peerfeedbacks for pom
    peerFeedbacks.push([]);
    this.populatePeerFeedbacks(result, peerFeedbacks);
  }

  populateMCQScores(result, mcqsScores) {
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
  }

  populateSelfFeedbacks(result, selfFeedbacks) {
    if (result.postAssessment.feedbackquestion_set) {
      this.pitchingOverview.enoughData = true;
      result.postAssessment.feedbackquestion_set.forEach(question => {
        question.feedbackuseranswer_set.forEach(answer => {
          if (answer.user.id === parseInt(this.learnerID, 10)) {
            selfFeedbacks[selfFeedbacks.length - 1].push(answer.rating_answer);
          }
        });
      });
    } else {
      this.pitchingOverview.enoughData = false;
    }
  }

  populatePeerFeedbacks(result, peerFeedbacks) {
    if (result.pom.feedbackquestion_set) {
      result.pom.feedbackquestion_set.forEach(question => {
        const userFeedback = result.pom.pitchomaticgroupmembers.find(
          member => member.user.id === parseInt(this.learnerID, 10)
        );
        const ratings = [];
        if (userFeedback) {
          userFeedback.pitchomaticfeedback_set.forEach(fb => {
            if (fb.feedbackquestion === question.id) {
              ratings.push(fb.rating_answer);
            }
          });
        }
        peerFeedbacks[peerFeedbacks.length - 1].push(ratings);
      });
    } else {
      this.pitchingOverview.enoughData = false;
    }
  }

  calculateMCQScores(mcqsScores) {
    if (mcqsScores[0].length) {
      this.mcqOverview.enoughData = true;
      let mcqAvg = 0;
      mcqsScores.forEach((sessionScore, sessionIndex) => {
        const sum = sessionScore.reduce((a, b) => a + b, 0);
        this.mcqOverview.chart.sessionInfo[sessionIndex].value = sum;
        mcqAvg = mcqAvg + sum / mcqsScores.length;
      });
      mcqAvg = (mcqAvg / mcqsScores[0].length) * 100;
      this.mcqOverview.donut.data = Math.round(mcqAvg);
    }
  }

  createWidgetComponents() {
    // tslint:disable-next-line:max-line-length
    const skillOverFactory = this.componentFactoryResolver.resolveComponentFactory(
      SkillOverviewComponent
    );

    const component = this.entry.createComponent(skillOverFactory);
    component.instance.overviewData = this.pitchingOverview;

    // const component2 = this.entry2.createComponent(skillOverFactory);
    // component2.instance.overviewData = overviewData2;

    // const component3 = this.entry3.createComponent(skillOverFactory);
    // component3.instance.overviewData = overviewData;

    // const component4 = this.entry4.createComponent(skillOverFactory);
    // component4.instance.overviewData = overviewData;

    // commented out mcq widget
    // const component5 = this.entry4.createComponent(skillOverFactory);
    // component5.instance.overviewData = this.mcqOverview;
  }

  verifyData(reports) {
    const verifiedReports = [];
    reports.forEach(report => {
      let verifiedReport = false;
      report.activity_results.forEach((act, i) => {
        let title = '';
        for (const key in act) {
          if (act.hasOwnProperty(key)) {
            if (key !== 'base_activity') {
              title = act['base_activity'].description;
              act = act[key];
              act.title = title;
            }
          }
        }

        if (act.activity_type === ActivityTypes.feedback) {
          if (act.title === 'How do you feel about pitching now?') {
            // obj.postAssessment = act as FeedbackReport;
          }
        } else if (act.activity_type === ActivityTypes.pitchoMatic) {
          const userFeedback = act.pitchomaticgroupmembers.find(
            member => member.user.id === parseInt(this.learnerID, 10)
          );

          act.feedbackquestion_set.forEach(question => {
            if (userFeedback) {
              if (userFeedback.pitchomaticfeedback_set.length) {
                // this user has feedback in POM
                verifiedReport = true;
              }
            }
          });
        } else if (
          act.activity_type === ActivityTypes.mcq &&
          // (act.title === 'weighted_mcq' ||
          //   act.title === 'Pop Quiz Q1' ||
          //   act.title === 'Pop Quiz Q2' ||
          //   act.title === 'Pop Quiz Q3' ||
          //   act.title === 'Pop Quiz Q4' ||
          //   act.title === 'Pop Quiz Q5')
          act.title === 'weighted_mcq'
        ) {
          // obj.mcqs.push(act);
        }
      });
      if (verifiedReport) {
        verifiedReports.push(report);
      }
    });
    return verifiedReports;
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
