import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { MatDialog } from '@angular/material';
import { LowAttendanceDialogComponent } from 'src/app/pages/lesson/shared/dialogs';
import { LobbyStartButtonClickEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainScreenLobbyComponent extends BaseActivityComponent
  implements OnInit, OnDestroy {
  dialogRef;
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  constructor(private dialog: MatDialog) {
    super();
  }

  openLowAttendanceDialog(): void {
    this.dialogRef = this.dialog
      .open(LowAttendanceDialogComponent, {
        data: {},
        disableClose: true,
        panelClass: 'low-response-dialog'
      })
      .afterClosed()
      .subscribe(res => {});
  }

  ngOnInit() {
    this.sfxPlayer.nativeElement.play();
  }

  ngOnDestroy() {
    this.sfxPlayer.nativeElement.pause();
  }

  kickOffLesson() {
    if (this.activityState.lesson_run.joined_users.length < 2) {
      this.openLowAttendanceDialog();
    } else {
      this.sendMessage.emit(new LobbyStartButtonClickEvent());
    }
  }
}
