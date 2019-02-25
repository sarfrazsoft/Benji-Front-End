import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { VideoStateService } from '../../services/video-state.service';
import { EndEvent } from '../../services/backend/schema/messages';

@Component({
  selector: 'app-main-screen-footer',
  templateUrl: './main-screen-footer.component.html',
  styleUrls: ['./main-screen-footer.component.scss']
})
export class MainScreenFooterComponent implements OnInit {
  @Input() showFooter: boolean;
  @Input() roomCode: string;
  public videoPause = false;

  constructor(private video: VideoStateService) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {}

  // public controlClicked(element, eventType) {
  //   if (eventType === 'rewind') {
  //     this.video.updateState(eventType);
  //     this.videoPause = false;
  //   } else if (eventType === 'toggleplayback') {
  //     this.videoPause = !this.videoPause;
  //     this.video.updateState(eventType);
  //   } else if (eventType === 'skip') {
  //     this.video.updateState(eventType);
  //   }
  // }

  public controlClicked(element, eventType) {
    if (eventType === 'rewind') {
      this.socketMessage.emit({
        'event': 'back'
      });
    } else if (eventType === 'skip') {
      this.socketMessage.emit(new EndEvent());
    }
  }
}
