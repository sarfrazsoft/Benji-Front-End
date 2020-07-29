import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
// import * as Chart from 'chart.js';
import { Chart, ChartColor, Point } from 'chart.js';
import { FeedbackGraphQuestion } from 'src/app/services/backend/schema';

export interface ChartElementsOptions {
  center?: any;
}

export interface DonutData {
  title: string;
  data: number;
  color: string;
}

@Component({
  selector: 'benji-learner-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss']
})
export class DonutComponent implements OnInit, AfterViewInit {
  @Input() donutData: DonutData;
  canvas: any;
  ctx: any;
  myChart: any;
  @ViewChild('chartCanvas', { static: true }) chartCanvas: ElementRef;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    const data = [this.donutData.data, 100 - this.donutData.data];

    this.canvas = document.getElementById('myChart');
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: [this.donutData.color, colors.grey]
          }
        ],

        labels: [this.donutData.title]
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
        scales: {},
        elements: {
          center: {
            text: this.donutData.data + '%',
            color: '#000', // Default is #000000
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20 // Defualt is 20 (as a percentage)
          }
        }
      }
    } as any);
  }
}

const colors = {
  benjiBlue: '#0a4cef',
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

Chart.pluginService.register({
  beforeDraw: function(chart: any) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      const ctx = chart.chart.ctx;

      // Get options from the center object in options
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || 'Arial';
      const txt = centerConfig.text;
      const color = centerConfig.color || '#000';
      const sidePadding = centerConfig.sidePadding || 20;
      const sidePaddingCalculated =
        (sidePadding / 100) * (chart.innerRadius * 2);
      // Start with a base font of 30px
      ctx.font = '30px ' + fontStyle;

      // Get the width of the string and also the width of the element minus
      // 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(30 * widthRatio);
      const elementHeight = chart.innerRadius * 2;

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      ctx.font = fontSizeToUse + 'px ' + fontStyle;
      ctx.fillStyle = color;

      // Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});
