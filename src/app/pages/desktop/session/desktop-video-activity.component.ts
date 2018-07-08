import {Component, OnInit, ViewEncapsulation, Input, Output, OnDestroy, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DesktopBaseActivityComponent } from './desktop-base-activity.component';

@Component({
  selector: 'app-desktop-activity-video',
  template:
    '<div class="centred-aligned-screen-body-div"> \
        <h1 class="content-header">{{ activityDetails.title }}</h1> \
        <div> \
          <iframe [src]=\'safeURL\' frameborder="0" allowfullscreen style="width:912px; height:513px;" allow="autoplay"></iframe>\
        </div> \
        <a class="welcome-button w-button" (click)="videoComplete.emit(true)">Next Activity</a> \
     </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopVideoActivityComponent extends DesktopBaseActivityComponent implements OnInit, OnDestroy {
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
