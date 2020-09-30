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
    this.store.select(fromStore.getActivityThumbnail(activity.activity_type)).subscribe((res) => {
      this.imgSrc = this.hostname + res;
      // console.log(this.imgSrc);
      return this.imgSrc;
    });
    // return this.hostname + activity.thumbnail;
  }
}
