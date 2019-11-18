import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'benji-key-stats',
  templateUrl: './key-stats.component.html',
  styleUrls: ['./key-stats.component.scss']
})
export class KeyStatsComponent implements OnInit, OnChanges {
  @Input() data: any = {};
  startDate = '';
  startTime = '';
  endDate = '';
  hostName = '';
  duration;
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.data && this.data.end_time) {
      this.duration = moment.duration(
        moment(this.data.end_time).diff(this.data.start_time)
      );
      this.startDate = moment(this.data.start_time).format('MMM D, YYYY');
      this.startTime = moment(this.data.start_time).format('hh:mma');
      this.duration =
        this.duration.get('hours') + ':' + this.duration.get('minutes');

      this.hostName =
        this.data.host.first_name + ' ' + this.data.host.last_name;
    }
  }
}
