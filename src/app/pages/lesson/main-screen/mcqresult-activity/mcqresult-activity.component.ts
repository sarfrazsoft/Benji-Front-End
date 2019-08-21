import { AfterViewInit, Component, OnChanges } from '@angular/core';
import * as Chart from 'chart.js';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-mcqresult-activity',
  templateUrl: './mcqresult-activity.component.html',
  styleUrls: ['./mcqresult-activity.component.scss']
})
export class MainScreenMcqresultActivityComponent extends BaseActivityComponent
  implements AfterViewInit, OnChanges {
  showStatistics = false;
  showChart = true;
  choices: Array<any> = [];
  question = '';
  optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F'];

  ngOnChanges() {
    const act = this.activityState.mcqresultsactivity;

    if (act.poll_mode) {
      this.showStatistics = true;
      this.showChart = false;

      this.question = act.question_list[0].question;

      this.choices = act.question_list[0].mcqchoice_set.map((choice, i) => {
        const answer_count = act.choices_summary.find(c => c.id === choice.id)
          .answer_count;

        const totalResponse = this.activityState.lesson_run.joined_users.length;

        return {
          text: choice.choice_text,
          noOfResponses: answer_count,
          responsePercent: Math.round((answer_count / totalResponse) * 100)
        };
      });
    }
  }

  renderChart() {
    const act = this.activityState.mcqresultsactivity;
    const labels = act.question_list.map(q => q.question);
    const canvas: any = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    const chartOptions = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '',
            data: [1, 2, 3, 4],
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
    };
    const myChart = new Chart(ctx, chartOptions);
  }

  ngAfterViewInit() {
    if (this.showChart) {
      this.renderChart();
    }
  }
}
