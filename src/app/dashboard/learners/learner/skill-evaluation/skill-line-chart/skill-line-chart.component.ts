import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'benji-skill-line-chart',
  templateUrl: './skill-line-chart.component.html',
  styleUrls: ['./skill-line-chart.component.scss'],
})
export class SkillLineChartComponent implements OnInit, AfterViewInit {
  @Input() chartData = {
    label: 'Sessions',
    sessionInfo: [
      {
        date: '2nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/02',
        value: 3,
      },
      {
        date: '14th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/14',
        value: 5,
      },
      {
        date: '12th Jan, 2020',
        name: 'Pitch practice',
        xlabel: '01/12',
        value: 7,
      },
      {
        date: '22nd Jan, 2020',
        name: 'Pitch perfect',
        xlabel: '01/22',
        value: 6,
      },
    ],
  };
  canvas: any;
  ctx: CanvasRenderingContext2D;
  myChart: any;
  @ViewChild('chartCanvas', { static: true }) chartCanvas: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const labels = [];
    const values = [];

    this.chartData.sessionInfo.forEach((s) => {
      labels.push(s.xlabel);
      values.push(s.value);
    });

    this.canvas = document.getElementById('myChart');
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: this.chartData.label,
            data: values,
            borderWidth: 5,
            backgroundColor: '#0a4cef',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 0,
            fontSize: 14,
            fontColor: '#000',
          },
        },
        tooltips: {
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              return this.chartData.sessionInfo[tooltipItem[0].index].name;
            },
            label: (tooltipItem, d) => {
              return this.chartData.sessionInfo[tooltipItem.index].date;
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
                fontSize: 14,
                stepSize: 2,
                beginAtZero: true,
                min: 0,
                max: 10,
                callback: function (value, index, valuest) {
                  return value ? value : '';
                },
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
                fontColor: '#000',
                fontSize: 14,
                beginAtZero: true,
              },
            } as any,
          ],
        },
      },
    });
  }
}
