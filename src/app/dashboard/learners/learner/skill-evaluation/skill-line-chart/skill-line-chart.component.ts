import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import * as Chart from 'chart.js';
import { FeedbackGraphQuestion } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-skill-line-chart',
  templateUrl: './skill-line-chart.component.html',
  styleUrls: ['./skill-line-chart.component.scss']
})
export class SkillLineChartComponent implements OnInit, AfterViewInit {
  @Input() question: FeedbackGraphQuestion;
  canvas: any;
  ctx: CanvasRenderingContext2D;
  myChart: any;
  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  dates = [
    '2nd Jan, 2020',
    '4th Jan, 2020',
    '12th Jan, 2020',
    '22nd Jan, 2020'
  ];

  sessions = [
    'Pitch perfect',
    'Pitch practice',
    'Pitch practice',
    'Pitch perfect'
  ];
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4'],
        datasets: [
          {
            label: 'Pitch Skill',
            data: [3, 5, 7, 6],
            borderWidth: 5,
            backgroundColor: '#0a4cef',
            fill: false
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
            title: (tooltipItem, d) => {
              return this.sessions[tooltipItem[0].index];
            },
            label: (tooltipItem, d) => {
              return this.dates[tooltipItem.index];
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
                fontColor: '#000',
                fontSize: 24,
                stepSize: 2,
                beginAtZero: true,
                min: 0,
                max: 10,
                callback: function(value, index, values) {
                  return value ? value : '';
                }
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
                fontColor: '#000',
                fontSize: 14,
                beginAtZero: true,
                callback: function(value, index, values) {
                  const j = value % 10,
                    k = value % 100;
                  if (j === 1 && k !== 11) {
                    return value + 'st session';
                  }
                  if (j === 2 && k !== 12) {
                    return value + 'nd session';
                  }
                  if (j === 3 && k !== 13) {
                    return value + 'rd session';
                  }
                  return value + 'th session';
                }
              }
            }
          ]
        }
      }
    });
  }
}
