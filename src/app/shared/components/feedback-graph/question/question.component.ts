import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from "@angular/core";
import * as Chart from "chart.js";
import { FeedbackGraphQuestion, User } from "src/app/services/backend/schema";
import { PastSessionsService } from "src/app/services/past-sessions.service";

@Component({
  selector: "benji-question",
  templateUrl: "./question.component.html",
  styleUrls: ["./question.component.scss"]
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() question: FeedbackGraphQuestion;
  @Input() showAvg = false;

  comboAnswers: Array<string> = [];
  averageRating = 0;
  canvas: any;
  ctx: CanvasRenderingContext2D;
  myChart: any;
  @ViewChild("chartCanvas") chartCanvas: ElementRef;
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(updatedUserFilter => {
      this.updateChart();
    });

    const assessments = [0, 0, 0, 0, 0];
    this.comboAnswers = [];
    let ratingSum = 0;
    const users = [[], [], [], [], []];
    this.question.assessments.forEach(answer => {
      if (
        this.pastSessionService.filteredInUsers.find(
          el => el === answer.user.id
        )
      ) {
        ratingSum = ratingSum + answer.rating;
        assessments[answer.rating - 1]++;
        users[answer.rating - 1].push(
          answer.user.first_name + " " + answer.user.last_name
        );
        this.comboAnswers.push(answer.text);
      }
    });
    this.averageRating = ratingSum / this.question.assessments.length;
    this.averageRating = Math.round(this.averageRating * 10) / 10;

    this.canvas = document.getElementById("myChart");
    this.ctx = this.chartCanvas.nativeElement.getContext("2d");
    this.myChart = new Chart(this.ctx, {
      type: "bar",
      data: {
        labels: this.question.labels,
        datasets: [
          {
            label: "",
            data: assessments,
            borderWidth: 1,
            backgroundColor: "#cadafe"
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
          displayColors: false,
          callbacks: {
            title: (tooltipItems, d) => {
              let res =
                tooltipItems[0].value === "1" ? " response" : " responses";
              return tooltipItems[0].value + res;
            },
            label: (tooltipItem, d) => {
              return "";
            },
            afterBody: (tooltipItems, d) => {
              return users[tooltipItems[0].index];
            }
          }
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: true
              },
              ticks: {
                fontColor: "#000",
                fontSize: 18,
                stepSize: 2,
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
                fontColor: "#000",
                fontSize: 14,
                stepSize: 1,
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  updateChart() {
    if (this.myChart) {
      const assessments = [0, 0, 0, 0, 0];
      this.comboAnswers = [];
      this.question.assessments.forEach(answer => {
        if (
          this.pastSessionService.filteredInUsers.find(
            el => el === answer.user.id
          )
        ) {
          assessments[answer.rating - 1]++;
          this.comboAnswers.push(answer.text);
        }
      });
      this.myChart.data.datasets[0].data = assessments;
      this.myChart.update();
    }
  }

  ngAfterViewInit() {}
}
