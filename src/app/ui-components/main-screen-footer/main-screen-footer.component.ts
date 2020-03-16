import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  EndEvent,
  FastForwardEvent,
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
  @Input() showFastForward: boolean;
  @Input() showFooter: boolean;
  @Input() lessonName: string;
  @Input() roomCode: string;
  @Input() isPaused: boolean;

  constructor(private videoStateService: VideoStateService) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {
    // if (this.isPaused) {
    //   this.videoStateService.videoState = 'pause';
    // } else if (!this.isPaused) {
    //   this.videoStateService.videoState = 'resume';
    // }
  }

  controlClicked(eventType) {
    // if (this.videoStateService.videoState) {
    // this.videoStateService.videoState = eventType;
    if (eventType === 'pause') {
      this.socketMessage.emit(new PauseActivityEvent());
    } else if (eventType === 'next') {
      // this.socketMessage.emit(new EndEvent());
      // Remove pitch notes if that activity was
      // fowarded without completion
      // The concerned activity should be told that it has been
      // skipped over so the activity can close properly
      // if (localStorage.getItem('pitchDraftNotes')) {
      //   localStorage.removeItem('pitchDraftNotes');
      // }
      this.socketMessage.emit(new NextInternalEvent());
    } else if (eventType === 'resume') {
      this.socketMessage.emit(new ResumeActivityEvent());
    } else if (eventType === 'fastForward') {
      this.socketMessage.emit(new FastForwardEvent());
    }
    // }
  }
}
