import {Component, OnInit, ViewEncapsulation, Input, Output, OnDestroy, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseActivityComponent } from '../../../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-video',
  templateUrl: './main-screen-video-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopVideoActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  @Output() videoComplete = new EventEmitter<boolean>();
  safeURL;

  constructor(private _sanitizer: DomSanitizer) { super(); }

  ngOnInit() {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
      this.activityDetails.videoactivity.video_link.replace('watch?v=', 'embed/') + '?autoplay=1');
  }

  ngOnDestroy() {
  }

}
