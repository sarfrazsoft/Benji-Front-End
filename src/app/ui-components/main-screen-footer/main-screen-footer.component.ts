import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EndEvent,
  NextInternalEvent,
  PauseActivityEvent,
  ResumeActivityEvent
} from '../../services/backend/schema/messages';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'app-main-screen-footer',
  templateUrl: './main-screen-footer.component.html',
  styleUrls: ['./main-screen-footer.component.scss']
})
export class MainScreenFooterComponent implements OnInit {
  @Input() showFooter: boolean;
  @Input() roomCode: string;
  @Input() isPaused: boolean;

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

  controlClicked(eventType) {
    if (eventType === 'pause') {
      this.socketMessage.emit(new PauseActivityEvent());
    } else if (eventType === 'next') {
      // this.socketMessage.emit(new EndEvent());
      this.socketMessage.emit(new NextInternalEvent());
    } else if (eventType === 'resume') {
      this.socketMessage.emit(new ResumeActivityEvent());
    }
  }
}
