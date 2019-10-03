import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as Chart from 'chart.js';
import { switchMap } from 'rxjs/operators';
import { PastSessionsService } from '../services/past-sessions.service';

@Component({
  selector: 'benji-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  canvas: any;
  ctx: CanvasRenderingContext2D;
  data: any;
  myChart: any;
  mcqs = {};
  assessments = [];
  @ViewChild('chartCanvas') chartCanvas: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private pastSessionsService: PastSessionsService
  ) {}

  ngOnInit() {
    this.pastSessionsService.getReports('73103').subscribe(res => {
      console.log(res);
      this.mcqs = res;
      // res.assessments.forEach(fback => {
      //   let avg = 0;
      //   const noOfQuestions = fback.feedbackquestion_set.length;
      //   fback.feedbackquestion_set.forEach(question => {
      //     avg = avg + parseFloat(question.average_rating);
      //   });
      //   avg = avg / noOfQuestions;
      //   this.assessments.push(Math.round(avg * 100) / 100);
      // });
      // console.log(this.assessments);
      // this.myChart.chart.update();
    });
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: ['Pre-assessment', 'Post-assessment'],
        datasets: [
          {
            label: '',
            data: this.assessments,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: '#979797',
                fontSize: 24,
                stepSize: 1,
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              barPercentage: 0.5,
              gridLines: {
                display: false
              },
              ticks: {
                fontColor: '#979797',
                fontSize: 24,
                stepSize: 1,
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}

// {"id":17,"start_time":"2019-09-13T15:44:56.614097-04:00","end_time":"2019-09-13T16:05:43.348363-04:00","lessonrun_code":32016,"joined_users":[{"id":2,"username":"matt","first_name":"Matt","last_name":"Parson","email":"matt@mybenji.com","verified_email":false,"job_title":"CEO","organization_name":"Benji","orggroup_name":"Sales","organization":1,"orggroup":1,"local_admin_permission":true,"participant_permission":true},{"id":8,"username":"khan","first_name":"khan","last_name":"","email":"","verified_email":false,"job_title":null,"organization_name":null,"orggroup_name":null,"organization":null,"orggroup":null,"local_admin_permission":false,"participant_permission":true}],"host":{"id":2,"username":"matt","first_name":"Matt","last_name":"Parson","email":"matt@mybenji.com","verified_email":false,"job_title":"CEO","organization_name":"Benji","orggroup_name":"Sales","organization":1,"orggroup":1,"local_admin_permission":true,"participant_permission":true},"activity_results":[{"id":504,"feedbackquestion_set":[{"id":81,"feedbackuseranswer_set":[],"average_rating":null,"question_type":"rating_agreedisagree","question_text":"What I learned in this session will improve my skills.","is_combo":true,"combo_text":"Why is that?","feedbackactivity":504,"pitchomaticactivity":null},{"id":82,"feedbackuseranswer_set":[],"average_rating":null,"question_type":"rating_agreedisagree","question_text":"I found this session fun","is_combo":true,"combo_text":null,"feedbackactivity":504,"pitchomaticactivity":null}],"titlecomponent":{"title":"Please leave some feedback for us!","title_image":"emoji://memo","screen_instructions":"We'd really appreciate your feedback. Submit on your phone- it’ll only take a minute!","participant_instructions":"What did you think about today's lesson?"},"activity_type":"FeedbackActivity"},{"id":501,"length":112.849585,"activity_type":"HintWordActivity"},{"id":493,"length":11.01519,"activity_type":"MCQResultsActivity"},{"id":492,"question":{"id":69,"question":"Research shows us we retain approximately how much information we hear?","mcqchoice_set":[{"id":266,"order":3,"choice_text":"75-85%","is_correct":false,"explanation":"Incorrect"},{"id":265,"order":2,"choice_text":"50-75%","is_correct":false,"explanation":"Incorrect"},{"id":264,"order":1,"choice_text":"25-50%","is_correct":true,"explanation":"Correct"},{"id":263,"order":0,"choice_text":"10-25%","is_correct":false,"explanation":"Incorrect"}]},"mcqactivityuseranswer_set":[],"activity_type":"MCQActivity"},{"id":491,"question":{"id":68,"question":"Active listening means listening with:","mcqchoice_set":[{"id":262,"order":3,"choice_text":"All of the above","is_correct":true,"explanation":"Correct"},{"id":261,"order":2,"choice_text":"No distractions","is_correct":false,"explanation":"Incorrect"},{"id":260,"order":1,"choice_text":"Self-awareness","is_correct":false,"explanation":"Incorrect"},{"id":259,"order":0,"choice_text":"Intent","is_correct":false,"explanation":"Incorrect"}]},"mcqactivityuseranswer_set":[],"activity_type":"MCQActivity"},{"id":490,"question":{"id":67,"question":"How many words per minute does the average person speak?","mcqchoice_set":[{"id":258,"order":3,"choice_text":"400","is_correct":false,"explanation":"Incorrect"},{"id":257,"order":2,"choice_text":"225","is_correct":false,"explanation":"Incorrect"},{"id":256,"order":1,"choice_text":"125","is_correct":true,"explanation":"Correct"},{"id":255,"order":0,"choice_text":"60","is_correct":false,"explanation":"Incorrect"}]},"mcqactivityuseranswer_set":[],"activity_type":"MCQActivity"},{"id":489,"question":{"id":66,"question":"What percentage of workplace performance issues are caused by strained relationships?","mcqchoice_set":[{"id":254,"order":3,"choice_text":"72%","is_correct":false,"explanation":"Incorrect"},{"id":253,"order":2,"choice_text":"65%","is_correct":true,"explanation":"Correct"},{"id":252,"order":1,"choice_text":"42%","is_correct":false,"explanation":"Incorrect"},{"id":251,"order":0,"choice_text":"35%","is_correct":false,"explanation":"Incorrect"}]},"mcqactivityuseranswer_set":[],"activity_type":"MCQActivity"},{"id":472,"length":2.461631,"activity_type":"TitleActivity"},{"id":503,"length":29.010523,"activity_type":"LobbyActivity"},{"id":500,"length":58.747772,"activity_type":"VideoActivity"},{"id":498,"length":122.301047,"activity_type":"DiscussionActivity"},{"id":488,"length":15.491075,"activity_type":"VideoActivity"},{"id":486,"length":122.042274,"activity_type":"DiscussionActivity"},{"id":480,"length":2.824734,"activity_type":"DiscussionActivity"},{"user_predictions":[],"user_preferences":[],"choice_stats":[{"id":66,"choice_name":"not famous","num_predictions":0,"num_preferences":0},{"id":65,"choice_name":"famous","num_predictions":0,"num_preferences":0}],"activity_type":"WhereDoYouStandActivity"},{"user_predictions":[],"user_preferences":[],"choice_stats":[{"id":63,"choice_name":"human languages","num_predictions":0,"num_preferences":0},{"id":64,"choice_name":"speak to animals","num_predictions":0,"num_preferences":0}],"activity_type":"WhereDoYouStandActivity"},{"user_predictions":[],"user_preferences":[],"choice_stats":[{"id":61,"choice_name":"past","num_predictions":0,"num_preferences":0},{"id":62,"choice_name":"future","num_predictions":0,"num_preferences":0}],"activity_type":"WhereDoYouStandActivity"},{"id":471,"length":3.529511,"activity_type":"VideoActivity"},{"id":502,"length":null,"activity_type":"VideoActivity"},{"id":497,"length":7.165091,"activity_type":"VideoActivity"},{"id":496,"length":3.700236,"activity_type":"RoleplayPairActivity"},{"id":495,"length":5.57134,"activity_type":"VideoActivity"},{"id":494,"length":2.299197,"activity_type":"RoleplayPairActivity"},{"id":499,"length":108.259418,"activity_type":"VideoActivity"},{"id":485,"length":22.02265,"activity_type":"VideoActivity"},{"id":484,"length":46.835375,"activity_type":"RoleplayPairActivity"},{"id":483,"length":7.275672,"activity_type":"VideoActivity"},{"id":482,"length":91.657911,"activity_type":"RoleplayPairActivity"},{"id":487,"length":214.224297,"activity_type":"VideoActivity"},{"id":479,"length":14.114267,"activity_type":"VideoActivity"},{"id":478,"length":2.534686,"activity_type":"RoleplayPairActivity"},{"id":477,"length":1.813932,"activity_type":"VideoActivity"},{"id":476,"length":1.373535,"activity_type":"RoleplayPairActivity"},{"id":481,"length":2.755567,"activity_type":"VideoActivity"}]}
