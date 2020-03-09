import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import * as moment from 'moment';
import { ActivityReport } from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';

@Component({
  selector: 'benji-key-stats',
  templateUrl: './key-stats.component.html',
  styleUrls: ['./key-stats.component.scss']
})
export class KeyStatsComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  startDate = '';
  startTime = '';
  endDate = '';
  hostName = '';
  duration;
  constructor(private pastSessionsService: PastSessionsService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.data && this.data.end_time) {
      this.duration = moment.duration(
        moment(this.data.end_time).diff(this.data.start_time)
      ) as moment.Duration;
      this.startDate = moment(this.data.start_time).format('MMM D, YYYY');
      this.startTime = moment(this.data.start_time).format('hh:mma');

      this.duration =
        this.duration.hours() +
        'h ' +
        (this.duration.minutes() < 9
          ? '0' + this.duration.minutes()
          : this.duration.minutes()) +
        'm';

      this.hostName =
        this.data.host.first_name + ' ' + this.data.host.last_name;
    }
  }

  selectAll() {
    this.pastSessionsService.selectAll();
  }
}
