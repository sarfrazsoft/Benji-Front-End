import { Component, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ContextService, PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-key-stats',
  templateUrl: './key-stats.component.html',
  styleUrls: ['./key-stats.component.scss'],
})
export class KeyStatsComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  userIsAdmin;
  lessonName = '';
  startDate = '';
  startTime = '';
  endDate = '';
  hostName = '';
  duration;
  constructor(private pastSessionsService: PastSessionsService, private contextService: ContextService) {}

  ngOnInit() {
    this.contextService.user$.subscribe((user) => {
      // TODO check if user is admin
      if (true) {
        this.userIsAdmin = true;
      }
    });
  }

  ngOnChanges() {
    if (this.data) {
      this.lessonName = this.data.lesson.lesson_name;
      if (this.data.end_time) {
        this.duration = moment.duration(
          moment(this.data.end_time).diff(this.data.start_time)
        ) as moment.Duration;
        this.duration =
          this.duration.hours() +
          'h ' +
          (this.duration.minutes() < 9 ? '0' + this.duration.minutes() : this.duration.minutes()) +
          'm';
      }
      this.startDate = moment(this.data.start_time).format('MMM D, YYYY');
      this.startTime = moment(this.data.start_time).format('hh:mma');

      this.hostName = this.data.host.first_name + ' ' + this.data.host.last_name;
    }
  }

  selectAll() {
    this.pastSessionsService.selectAll();
  }
}
