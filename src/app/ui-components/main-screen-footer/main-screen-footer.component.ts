import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EndEvent,
  NextInternalEvent,
  PauseActivityEvent,
  ResumeActivityEvent
} from '../../services/backend/schema/messages';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'benji-main-screen-footer',
  templateUrl: './main-screen-footer.component.html',
  styleUrls: ['./main-screen-footer.component.scss']
})
export class MainScreenFooterComponent implements OnInit {
  @Input() showFooter: boolean;
  @Input() lessonName: string;
  @Input() roomCode: string;
  @Input() isPaused: boolean;

  constructor(private videoStateService: VideoStateService) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {
    if (this.isPaused) {
      this.videoStateService.videoState = 'pause';
    } else if (!this.isPaused) {
      this.videoStateService.videoState = 'resume';
    }
  }

  controlClicked(eventType) {
    this.videoStateService.videoState = eventType;
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
