import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgOnChangesFeature } from '@angular/core/src/render3';
import { ActivityReport } from 'src/app/services/backend/schema';
import { BrainstormReport } from 'src/app/services/backend/schema/reports/brainstorm';

@Component({
  selector: 'benji-brain-storm',
  templateUrl: './brain-storm.component.html',
  styleUrls: ['./brain-storm.component.scss'],
})
export class BrainStormComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  brainstorm: ActivityReport['brainstorm'];
  constructor() {}

  ngOnInit() {
    this.brainstorm = this.data.brainstorm;
  }
  ngOnChanges() {
    this.brainstorm = this.data.brainstorm;
  }
}
