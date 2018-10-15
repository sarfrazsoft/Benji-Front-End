import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'app-main-screen-footer',
  templateUrl: './main-screen-footer.component.html',
  styleUrls: ['./main-screen-footer.component.scss']
})
export class MainScreenFooterComponent implements OnInit {
  @Input() showFooter: boolean;
  @Input() roomCode: string;
  @Input() showVideoControls: boolean;
  public videoPause = false;

  constructor(private video: VideoStateService) { }

  ngOnInit() {
  }

  public controlClicked(element, eventType) {
    if (eventType === 'rewind') {
      this.video.updateState(eventType);
      this.videoPause = false;
    } else if (eventType === 'toggleplayback') {
      this.videoPause = !this.videoPause;
      this.video.updateState(eventType);
    }
  }

}
