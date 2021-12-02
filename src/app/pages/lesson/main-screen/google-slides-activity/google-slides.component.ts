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
  // https://docs.google.com/presentation/d/1HzNwrvyaUYi8ZKi8csK1SOTSKC07ePBeENOt-MPLXek/preview
  initVideo() {
    let url = this.activityState.googleslidesactivity.slide_url;
    url = url.replace('/pub', '/embed');
    // this.videoURL = this.activityState.googleslidesactivity.slide_url;
    this.videoURL = url;
    // 'https://docs.google.com/presentation/d/1HzNwrvyaUYi8ZKi8csK1SOTSKC07ePBeENOt-MPLXek/preview';
    // 'https://docs.google.com/presentation/d/e/2PACX-1vRoKUJq6iFZmjUavTVZIaglj-5U6WiFClc2jUwh4BLskajJ18eNjSfjRKI/embed?start=false&loop=false&delayms=3000';
    // 'https://docs.google.com/presentation/d/e/2PACX-1vRoKUJq6iFZmjUavTVZIaglj-5U6WiFClc2jUwh4BLskajJ18eNjSfjRKI/pub?start=false&loop=false&delayms=3000';
  }

  ngOnAfterViewInit() {}

  ngOnDestroy() {}
}
