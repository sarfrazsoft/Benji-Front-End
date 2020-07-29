import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { VideoStateService } from 'src/app/services';
import { EndEvent, PauseActivityEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-activity-video',
  templateUrl: './video-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class MainScreenVideoActivityComponent extends BaseActivityComponent
  implements OnInit, OnDestroy {
  @ViewChild('player', { static: true }) player: ElementRef;
  private videoPlaying = true;
  public _videoURL;
  private videoStateSubscription;

  constructor(private video: VideoStateService) {
    super();
  }

  ngOnInit() {
    this._videoURL = this.activityState.videoactivity.video_url;
    this.player.nativeElement.load();
    this.player.nativeElement.play();

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
