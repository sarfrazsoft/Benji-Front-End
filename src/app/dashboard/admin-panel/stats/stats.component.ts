import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  stats = [];
  constructor() {}

  ngOnInit() {
    this.stats = [
      { value: 105, label: 'total learners' },
      { value: 13, label: 'groups' },
      { value: 17, label: 'sessions completed' }
    ];
  }
}
