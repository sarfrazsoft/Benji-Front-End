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
  selector: 'benji-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() question: FeedbackGraphQuestion;
  canvas: any;
  ctx: CanvasRenderingContext2D;
  myChart: any;
  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.question.labels,
        datasets: [
          {
            label: '',
            data: this.question.assessments,
            borderWidth: 1,
            backgroundColor: '#0a4cef'
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
                display: true
              },
              ticks: {
                fontColor: '#000',
                fontSize: 24,
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
                fontColor: '#000',
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
}
