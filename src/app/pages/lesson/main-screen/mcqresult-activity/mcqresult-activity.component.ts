import { AfterViewInit, Component, OnChanges, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-mcqresult-activity',
  templateUrl: './mcqresult-activity.component.html',
  styleUrls: ['./mcqresult-activity.component.scss'],
})
export class MainScreenMcqresultActivityComponent
  extends BaseActivityComponent
  implements AfterViewInit, OnChanges, OnInit {
  showStatistics = false;
  showLeaderBoard = false;
  singleUserLesson = false;
  showChart = true;
  choices: Array<any> = [];
  question = '';
  optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F'];
  leaderBoardUsers = [];

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    const act = this.activityState.mcqresultsactivity;

    this.singleUserLesson = this.activityState.lesson.single_user_lesson;

    if (act.poll_mode) {
      this.showStatistics = true;
      this.showChart = false;

      if (act.question_list.length) {
        this.question = act.question_list[0].question;

        this.choices = act.question_list[0].mcqchoice_set.map((choice, i) => {
          if (act.choices_summary.length) {
            const answer_count = act.choices_summary.find((c) => c.id === choice.id).answer_count;

            const totalResponse = this.activityState.lesson_run.participant_set.length;

            return {
              text: choice.choice_text,
              noOfResponses: answer_count,
              responsePercent: Math.round((answer_count / totalResponse) * 100),
              order: choice.order,
            };
          }
        });

        this.choices.sort((a, b) => a.order - b.order);
      }
    }
    if (false) {
      this.showStatistics = false;
      this.showChart = false;
      this.showLeaderBoard = true;

      this.leaderBoardUsers = this.activityState.lesson_run.participant_set.map((u) => {
        const score = act.results_summary.filter((a) => a.participant_code === u.participant_code)
          ? act.results_summary.filter((a) => a.participant_code === u.participant_code)[0].score
          : 0;
        return { name: this.getParticipantName(u.participant_code), score: score };
      });

      this.leaderBoardUsers = this.leaderBoardUsers.sort((a, b) => {
        return b.score - a.score;
      });
      console.log(act);
    }
  }

  renderChart() {
    const act = this.activityState.mcqresultsactivity;
    const labels = act.question_list.map((q) => q.question);
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
            borderWidth: 1,
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
          enabled: false,
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: '#979797',
                fontSize: 24,
                stepSize: 1,
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.5,
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: '#979797',
                fontSize: 24,
                stepSize: 1,
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
    const myChart = new Chart(ctx, chartOptions);
  }

  ngAfterViewInit() {
    if (this.showChart) {
      this.renderChart();
    }
  }

  getUserScore() {
    const scoreCard = this.activityState.mcqresultsactivity.results_summary.find((r) => {
      return r.participant_code === this.getParticipantCode();
    });

    return scoreCard.score;
  }

  getTotalQuestions() {
    return this.activityState.mcqresultsactivity.total;
  }

  getPercentageScore() {
    return (this.getUserScore() / this.getTotalQuestions()) * 100;
  }
}
