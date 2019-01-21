import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ElementRef,
  ViewChild
} from '@angular/core';
import { VideoStateService } from '../../../../services/video-state.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-video',
  templateUrl: './main-screen-video-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class MainScreenVideoActivityComponent extends BaseActivityComponent
  implements OnInit, OnDestroy {
  @ViewChild('player') player: ElementRef;
  private videoPlaying = true;
  public _videoURL;
  private videoStateSubscription;

  constructor(private video: VideoStateService) {
    super();
  }

  ngOnInit() {
    this._videoURL = this.activityState.activity_status.video_url;
    this.player.nativeElement.load();
    this.player.nativeElement.play();

    this.videoStateSubscription = this.video.stateChanged$.subscribe(state => {
      if (state === 'rewind') {
        this.player.nativeElement.currentTime = 0;
        this.videoPlaying = true;
        this.player.nativeElement.play();
      } else if (state === 'toggleplayback') {
        // this.player
        this.videoPlaying = !this.videoPlaying;
        this.videoPlaying
          ? this.player.nativeElement.play()
          : this.player.nativeElement.pause();
      } else if (state === 'skip') {
        this.skipVideo();
      }
    });
  }

  ngOnDestroy() {
    this.videoStateSubscription.unsubscribe();
  }

  public skipVideo() {
    this.player.nativeElement.pause();
    this.videoEnd();
  }

  public videoEnd() {
    this.sendMessage.emit({ event: 'end' });
  }
}
