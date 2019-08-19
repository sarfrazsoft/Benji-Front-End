import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  ctx: any;

  constructor(
    private route: ActivatedRoute,
    private pastSessionsService: PastSessionsService
  ) {}

  ngOnInit() {
    this.pastSessionsService.getReports('2').subscribe(res => {
      console.log(res);
    });
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: ['Bazooka', 'Crossbow', 'Boat'],
        datasets: [
          {
            label: '',
            data: [1, 2, 3],
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
