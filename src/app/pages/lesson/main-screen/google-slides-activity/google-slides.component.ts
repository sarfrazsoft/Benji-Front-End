import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { VideoStateService } from 'src/app/services';
import { EndEvent, PauseActivityEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-google-slides',
  templateUrl: './google-slides.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class MainScreenGoogleSlidesActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnDestroy {
  // @ViewChild('player', { static: true }) player: ElementRef;
  // private videoPlaying = true;
  public videoURL;

  constructor(private video: VideoStateService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.initVideo();
  }

  initVideo() {
    this.videoURL = this.activityState.videoactivity.video_url;
  }

  ngOnAfterViewInit() {}

  ngOnDestroy() {}
}
