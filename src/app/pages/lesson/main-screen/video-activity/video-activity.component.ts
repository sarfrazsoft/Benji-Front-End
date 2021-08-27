import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { VideoStateService } from 'src/app/services';
import { EndEvent, PauseActivityEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-activity-video',
  templateUrl: './video-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class MainScreenVideoActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  @ViewChild('player', { static: true }) player: ElementRef;
  private videoPlaying = true;
  public videoURL;
  youtube = false;
  private videoStateSubscription;

  constructor(private video: VideoStateService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.initVideo();
    // const videoURL =
    // https://player.vimeo.com/external/298882708.hd.mp4?s=f304aa90e03c694ca828c2c4e6c73d86213b39e7&profile_id=175
    // const videoURL = 'https://www.youtube.com/embed/V0PisGe66mY';
    // const videoURL = 'https://www.youtube.com/watch?v=V0PisGe66mY&ab_channel=AltraModaMusic';

    // this.player.nativeElement.load();
    // this.player.nativeElement.play();

    // this.video.videoState$.subscribe(state => {
    //   if (state === 'pause') {
    //     this.player.nativeElement.pause();
    //   } else if (state === 'resume') {
    //     this.player.nativeElement.play();
    //     if (!this.player.nativeElement) {
    //       // this.socketMessage.emit(new PauseActivityEvent());
    //       // this.sendMessage.emit(new PauseActivityEvent());
    //     }
    //   }
    // });
  }

  initVideo() {
    this.videoURL = this.activityState.videoactivity.video_url;

    if (this.videoURL) {
      if (this.videoURL.includes('youtube.com') || this.videoURL.includes('youtu.be')) {
        // youtube url
        this.youtube = true;
        if (this.videoURL.includes('embed')) {
          // video is already an embed link
        } else {
          const id = this.getYoutubeVideoId(this.videoURL);
          this.videoURL = 'https://www.youtube.com/embed/' + id;
        }
      } else {
        this.youtube = false;
        // vimeo url
      }
    }
  }

  getYoutubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  }

  ngOnAfterViewInit() {}

  ngOnDestroy() {
    // this.videoStateSubscription.unsubscribe();
    // this.video.videoState$.unsubscribe();
  }

  public skipVideo() {
    this.player.nativeElement.pause();
    this.videoEnd();
  }

  public videoEnd() {
    this.sendMessage.emit(new EndEvent());
  }
}
