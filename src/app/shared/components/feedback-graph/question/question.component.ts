import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import { ImageSelectorComponent } from 'src/app/dashboard/editor/services';
import { PastSessionsService } from 'src/app/services';
import { FeedbackGraphQuestion, User } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-question',
  templateUrl: './question.component.html',
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() question: FeedbackGraphQuestion;
  @Input() showAvg = false;
  @Input() userFilter = false;
  @Input() cardTitle = '';

  comboAnswers: Array<string> = [];
  comboAnswersExist = false;
  averageRating = 0;
  canvas: any;
  ctx: CanvasRenderingContext2D;
  myChart: any;
  users = [[], [], [], [], []];
  labelsSet = {};
  @ViewChild('chartCanvas', { static: true }) chartCanvas: ElementRef;
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.updateChart();
    });

    const assessments = [0, 0, 0, 0, 0];
    this.comboAnswers = [];
    this.comboAnswersExist = false;
    let ratingSum = 0;
    let noOfRatings = 0;

    this.question.assessments.forEach((answer) => {
      if (
        this.pastSessionService.filteredInUsers.find((el) => el === answer.participant_code) ||
        !this.userFilter
      ) {
        ratingSum = ratingSum + answer.rating;
        noOfRatings = noOfRatings + 1;
        assessments[answer.rating - 1]++;
        if (answer.rating > 0) {
          this.users[answer.rating - 1].push(
            this.pastSessionService.getParticipantName(answer.participant_code)
          );
        }
        if (answer.text) {
          this.comboAnswersExist = true;
        }
        this.comboAnswers.push(answer.text);
      }
    });
    if (noOfRatings) {
      this.averageRating = ratingSum / noOfRatings;
      this.averageRating = Math.round(this.averageRating * 10) / 10;
    } else {
      this.averageRating = 0;
    }

    // let max = assessments.reduce(
    //   (prev, curr) => (prev > curr ? prev : curr),
    //   0
    // );
    // if (max < 10) {
    //   // round to ceil even number
    //   max = max % 2 ? max + 1 : max;
    // } else {
    //   // round to ceil five number
    //   max = Math.ceil(max / 10) * 10;
    // }

    // console.log(max);

    // Chart.defaults.global.tooltips.custom = function(tooltip) {
    //   // Tooltip Element
    //   const tooltipEl = document.getElementById('chartjs-tooltip');

    //   // Hide if no tooltip
    //   if (tooltip.opacity === 0) {
    //     tooltipEl.style.opacity = '0';
    //     return;
    //   }

    //   // Set caret Position
    //   tooltipEl.classList.remove('above', 'below', 'no-transform');
    //   if (tooltip.yAlign) {
    //     tooltipEl.classList.add(tooltip.yAlign);
    //   } else {
    //     tooltipEl.classList.add('no-transform');
    //   }

    //   function getBody(bodyItem) {
    //     return bodyItem.lines;
    //   }

    //   // Set Text
    //   if (tooltip.body) {
    //     const titleLines = tooltip.title || [];
    //     const bodyLines = tooltip.body.map(getBody);

    //     let innerHtml = '<thead>';

    //     titleLines.forEach(function(title) {
    //       innerHtml += '<tr><th>' + title + '</th></tr>';
    //     });
    //     innerHtml += '</thead><tbody>';

    //     bodyLines.forEach(function(body, i) {
    //       const colors = tooltip.labelColors[i];
    //       let style = 'background:' + colors.backgroundColor;
    //       style += '; border-color:' + colors.borderColor;
    //       style += '; border-width: 2px';
    //       const span =
    //         '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
    //       innerHtml += '<tr><td>' + span + body + '</td></tr>';
    //     });
    //     innerHtml += '</tbody>';

    //     const tableRoot = tooltipEl.querySelector('table');
    //     tableRoot.innerHTML = innerHtml;
    //   }

    //   const positionY = this._chart.canvas.offsetTop;
    //   const positionX = this._chart.canvas.offsetLeft;

    //   // Display, position, and set styles for font
    //   tooltipEl.style.opacity = '1';
    //   tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    //   tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    //   tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
    //   tooltipEl.style.fontSize = tooltip.bodyFontSize + '';
    //   tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
    //   tooltipEl.style.padding =
    //     tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
    // };
    const images = [
      '../../../assets/img/reportsIcons/feedback.svg',
      'https://i.stack.imgur.com/Tq5DA.png',
      'https://i.stack.imgur.com/3KRtW.png',
      'https://i.stack.imgur.com/iLyVi.png',
      'https://i.stack.imgur.com/iLyVi.png',
    ];

    this.canvas = document.getElementById('myChart');
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      plugins: [
        {
          // afterDraw
          afterDraw: (chart: any) => {
            const ctx = chart.ctx;
            const xAxis = chart.scales['x-axis-0'];
            const yAxis = chart.scales['y-axis-0'];
            if (this.question.label_icons) {
              const labelIcons = this.question.label_icons;
              xAxis.ticks.forEach((value, index) => {
                const x = xAxis.getPixelForTick(index);
                if (this.labelsSet[index]) {
                  ctx.drawImage(this.labelsSet[index], x - 12, yAxis.bottom + 10);
                } else {
                  const image = new Image();
                  image.src = '../../../assets/img/reportsIcons/' + labelIcons[index];
                  this.labelsSet = { ...this.labelsSet, [index]: image };
                  image.onload = () => {
                    // When image loaded, you can then draw it on the canvas.
                    ctx.drawImage(image, x - 12, yAxis.bottom + 10);
                  };
                }
              });
            }
          },
        },
      ],
      data: {
        labels: this.question.labels,
        datasets: [
          {
            label: '',
            data: assessments,
            borderWidth: 1,
            backgroundColor: '#cadafe',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          caretSize: 0,
          displayColors: false,
          callbacks: {
            title: (tooltipItems, d) => {
              const res = tooltipItems[0].value === '1' ? ' response' : ' responses';
              return tooltipItems[0].value + res;
            },
            label: (tooltipItem, d) => {
              return '';
            },
            afterBody: (tooltipItems, d) => {
              return this.users[tooltipItems[0].index];
              // return [
              //   'yolo',
              //   'more yolo',
              //   'yolo',
              //   'more yolo',
              //   'yolo',
              //   'more yolo',
              //   'yolo',
              //   'more yolo',
              //   'yolo',
              //   'more yolo',
              //   'yolo',
              //   'more yolo'
              // ];
            },
          },
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: true,
              },
              ticks: {
                fontColor: '#000',
                fontSize: 16,
                beginAtZero: true,
                // min: 0,
                // max: max,
                // stepSize: Math.ceil(max / 5),
                callback: function (value: number, index: number, values: number[]) {
                  // do not display the first value and last value
                  // only display when it's a whole number
                  // return index === values.length - 1
                  //   ? ''
                  //   : Math.floor(value) === value
                  //   ? value
                  //   : '';
                  return Math.floor(value) === value ? value : '';
                  // return value;
                },
              },
            },
          ],
          xAxes: [
            {
              // TODO figure out barPercentage
              barPercentage: 0.5,
              gridLines: {
                display: false,
              },
              ticks: {
                padding: 30,
                fontColor: '#000',
                fontSize: 16,
                stepSize: 1,
                beginAtZero: true,
                // callback: function (value, index, values) {
                //   return '<img src="https://i.stack.imgur.com/2RAv2.png">' + value;
                // },
              },
            } as any,
          ],
        },
      },
    });
  }

  updateChart() {
    if (this.myChart) {
      const assessments = [0, 0, 0, 0, 0];
      this.comboAnswers = [];
      let ratingSum = 0;
      let noOfRatings = 0;
      this.users = [[], [], [], [], []];
      this.question.assessments.forEach((answer) => {
        if (
          this.pastSessionService.filteredInUsers.find((el) => el === answer.participant_code) ||
          !this.userFilter
        ) {
          ratingSum = ratingSum + answer.rating;
          noOfRatings = noOfRatings + 1;
          assessments[answer.rating - 1]++;
          if (answer.rating > 0) {
            this.users[answer.rating - 1].push(
              this.pastSessionService.getParticipantName(answer.participant_code)
            );
          }
          this.comboAnswers.push(answer.text);
        }
      });
      if (noOfRatings) {
        this.averageRating = ratingSum / noOfRatings;
        this.averageRating = Math.round(this.averageRating * 10) / 10;
      } else {
        this.averageRating = 0;
      }
      this.myChart.data.datasets[0].data = assessments;
      this.myChart.update();
    }
  }

  ngAfterViewInit() {}
}
