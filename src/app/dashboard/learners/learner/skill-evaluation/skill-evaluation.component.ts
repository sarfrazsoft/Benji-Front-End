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
  selector: 'benji-skill-evaluation',
  templateUrl: './skill-evaluation.component.html',
  styleUrls: ['./skill-evaluation.component.scss']
})
export class SkillEvaluationComponent implements OnInit, AfterViewInit {
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
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [10, 20, 30],
            backgroundColor: [
              colors.red,
              colors.orange,
              colors.yellow,
              colors.green,
              colors.blue
            ]
          }
        ],

        labels: ['Red', 'Yellow', 'Blue']
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        tooltips: {
          enabled: true
        },
        scales: {}
      }
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
