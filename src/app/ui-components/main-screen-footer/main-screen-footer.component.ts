import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { User } from 'src/app/services/backend/schema';
import { ConfirmationDialogComponent } from 'src/app/shared';
import {
  BootUserEvent,
  BrainstormToggleCategoryModeEvent,
  EndEvent,
  FastForwardEvent,
  NextInternalEvent,
  PauseActivityEvent,
  ResumeActivityEvent,
  ServerMessage,
  UpdateMessage,
} from '../../services/backend/schema/messages';
import { VideoStateService } from '../../services/video-state.service';

@Component({
  selector: 'benji-main-screen-footer',
  templateUrl: './main-screen-footer.component.html',
  styleUrls: ['./main-screen-footer.component.scss'],
})
export class MainScreenFooterComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() showFastForward: boolean;
  @Input() showFooter: boolean;
  @Input() lessonName: string;
  @Input() roomCode: string;
  @Input() isPaused: boolean;

  participants: Array<User> = [];
  dialogRef;

  constructor(
    private videoStateService: VideoStateService,
    private dialog: MatDialog
  ) {}

  @Output() socketMessage = new EventEmitter<any>();

  ngOnInit() {
    // if (this.isPaused) {
    //   this.videoStateService.videoState = 'pause';
    // } else if (!this.isPaused) {
    //   this.videoStateService.videoState = 'resume';
    // }
  }

  ngOnChanges() {
    this.participants = this.activityState.lesson_run.joined_users;
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

  deleteUser(p: User) {
    const msg =
      'Are you sure you want to delete ' +
      p.first_name +
      ' ' +
      p.last_name +
      '?';
    this.dialogRef = this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: msg,
        },
        disableClose: true,
        panelClass: 'dashboard-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          console.log('delete', p.first_name);
          this.socketMessage.emit(new BootUserEvent(p.id));
        }
      });
  }

  toggleCategorization() {
    this.socketMessage.emit(new BrainstormToggleCategoryModeEvent());
  }
}
