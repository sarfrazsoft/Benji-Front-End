import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromStore from '../../store';

@Component({
  selector: 'benji-overview-thumbnail',
  templateUrl: './overview-thumbnail.component.html',
  styleUrls: ['./overview-thumbnail.component.scss'],
})
export class OverviewThumbnailComponent implements OnInit {
  @Input() act;
  hostname = window.location.protocol + '//' + environment.host;
  imgSrc = '';
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.getThumbnailSrc(this.act);
  }

  getThumbnailSrc(activity) {
    if (activity.activity_type) {
      this.store.select(fromStore.getActivityThumbnail(activity.activity_type)).subscribe((res) => {
        this.imgSrc = this.hostname + res;
        return this.imgSrc;
      });
    } else {
      this.imgSrc = '/assets/img/blank_activity.svg';
    }
  }
}
