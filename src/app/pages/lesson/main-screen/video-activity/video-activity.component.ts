import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { VideoStateService } from 'src/app/services';
import { EndEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { BitrateOption, VgAPI } from 'videogular2/core';
import { VgDASH } from 'videogular2/src/streaming/vg-dash/vg-dash';
import { VgHLS } from 'videogular2/src/streaming/vg-hls/vg-hls';
import { IDRMLicenseServer } from 'videogular2/streaming';

export interface IMediaStream {
  type: 'vod' | 'dash' | 'hls';
  source: string;
  label: string;
  token?: string;
  licenseServers?: IDRMLicenseServer;
}

declare let Hls;

@Component({
  selector: 'benji-ms-activity-video',
  templateUrl: './video-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class MainScreenVideoActivityComponent extends BaseActivityComponent
  implements OnInit, OnDestroy {
  @ViewChild(VgDASH) vgDash: VgDASH;
  @ViewChild(VgHLS) vgHls: VgHLS;

  currentStream: IMediaStream;
  api: VgAPI;

  bitrates: BitrateOption[];

  streams: IMediaStream[] = [
    {
      type: 'vod',
      label: 'VOD',
      source: 'http://static.videogular.com/assets/videos/videogular.mp4'
    },
    {
      type: 'dash',
      label: 'DASH: Multi rate Streaming',
      source: 'http://dash.edgesuite.net/akamai/bbb_30fps/bbb_30fps.mpd'
    },
    {
      type: 'dash',
      label: 'DASH: Live Streaming',
      source:
        'https://24x7dash-i.akamaihd.net/dash/live/900080/dash-demo/dash.mpd'
    },
    {
      type: 'dash',
      label: 'DASH: DRM with Widevine',
      source:
        'https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd',
      licenseServers: {
        'com.widevine.alpha': {
          serverURL: 'https://widevine-proxy.appspot.com/proxy'
        }
      }
    },
    {
      type: 'hls',
      label: 'HLS: Streaming',
      source:
        'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
    }
  ];
  @ViewChild('player') player: ElementRef;
  private videoPlaying = true;
  public _videoURL;
  private videoStateSubscription;
  private videoJSplayer: any;

  constructor(private video: VideoStateService) {
    super();
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }

  ngOnInit() {
    this._videoURL = this.activityState.videoactivity.video_url;
    // this.currentStream = this.streams[4];
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

  // https://player.vimeo.com/external/298881840.hd.mp4?s=1a435cd9996df024347ad1b6d435e922c0c15ace&profile_id=175
  // https://player.vimeo.com/external/298880631.m3u8?s=872dfb842b0241bb9c59fac10c95f0d62540d78c
  ngOnAfterViewInit() {
    // this.videoJSplayer = videojs(document.getElementById('video_player_id'));
    // this.videoJSplayer.src({
    //   src:
    //     'https://player.vimeo.com/external/298880631.m3u8?s=872dfb842b0241bb9c59fac10c95f0d62540d78c',
    //   type: 'application/x-mpegURL'
    // });
    // this.videoJSplayer.play();
    //   {
    //     flash: {
    //       swf:
    //         'https://unpkg.com/@brightcove/videojs-flashls-source-handler/dist/video-js.swf'
    //     }
    //   },
    //   function() {
    //     this.play();
    //   }
    // );
  }

  ngOnDestroy() {
    this.videoStateSubscription.unsubscribe();
  }

  public skipVideo() {
    this.player.nativeElement.pause();
    this.videoEnd();
  }

  public videoEnd() {
    this.sendMessage.emit(new EndEvent());
  }

  setBitrate(option: BitrateOption) {
    switch (this.currentStream.type) {
      case 'dash':
        this.vgDash.setBitrate(option);
        break;

      case 'hls':
        this.vgHls.setBitrate(option);
        break;
    }
  }

  onClickStream(stream: IMediaStream) {
    this.api.pause();
    this.bitrates = null;

    const timer: Subscription = TimerObservable.create(0, 10).subscribe(() => {
      this.currentStream = stream;
      timer.unsubscribe();
    });
  }
}
