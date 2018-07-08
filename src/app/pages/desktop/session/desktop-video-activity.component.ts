import {Component, OnInit, ViewEncapsulation, OnDestroy} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {BackendService} from '../../../services/backend.service';

import {interval} from 'rxjs/internal/observable/interval';


@Component({
  selector: 'app-desktop-activity-title',
  template:
    '<div class="centred-aligned-screen-body-div"> \
        <h1 class="content-header">{{ activityDetails.current_activity.title }}</h1> \
        <div> \
          <iframe [src]=\'safeURL\' frameborder="0" allowfullscreen style="width:912px; height:513px;" allow="autoplay"></iframe>\
        </div> \
        <a class="welcome-button w-button" (click)="nextActivity()">Next Activity</a> \
     </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopVideoActivityComponent implements OnInit, OnDestroy {
  public activityDetails;
  public sessionDetails;
  safeURL;

  constructor(private backend: BackendService, private _sanitizer: DomSanitizer) {
    this.activityDetails = {'activity': {'videoactivity': {'video_link': 'http://youtube.com'}}};
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  dataInit() {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(
      this.activityDetails.current_activity.videoactivity.video_link.replace('watch?v=', 'embed/') + '?autoplay=1');
  }

  nextActivity() {
    this.backend.start_next_activity(this.sessionDetails.session.id).subscribe();
  }
}
