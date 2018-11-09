import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ElementRef,
  ViewChild
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BaseActivityComponent } from "../../../../shared/base-activity.component";
import { WebSocketService } from "../../../../../services/socket.service";
import { VideoStateService } from "../../../../../services/video-state.service";

@Component({
  selector: "app-mainscreen-activity-video",
  templateUrl: "./main-screen-video-activity.component.html",
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class MainScreenVideoActivityComponent extends BaseActivityComponent
  implements OnInit, OnDestroy {
  @Output()
  videoComplete = new EventEmitter<boolean>();
  safeURL;

  @Input() set videoURL(URL) {
    this._videoURL = URL;
    this.player.nativeElement.load();
    this.player.nativeElement.play();
  }

  @ViewChild("player")
  player: ElementRef;
  private videoPlaying = true;
  public _videoURL;
  private videoStateSubscription;

  constructor(
    private _sanitizer: DomSanitizer,
    private socket: WebSocketService,
    private video: VideoStateService
  ) {
    super();
  }

  ngOnInit() {
    this.videoStateSubscription = this.video.stateChanged$.subscribe(state => {
      if (state === "rewind") {
        this.player.nativeElement.currentTime = 0;
        this.videoPlaying = true;
        this.player.nativeElement.play();
      } else if (state === "toggleplayback") {
        // this.player
        this.videoPlaying = !this.videoPlaying;
        this.videoPlaying
          ? this.player.nativeElement.play()
          : this.player.nativeElement.pause();
      } else if (state === "skip") {
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
    this.videoComplete.emit(true);
    this.socket.sendSocketEventMessage("end");
  }
}
