import {
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LowAttendanceDialogComponent } from 'src/app/pages/lesson/shared/dialogs';
import { ContextService } from 'src/app/services';
import { LobbySetNicknameEvent, LobbyStartButtonClickEvent } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-lobby',
  templateUrl: './lobby.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MainScreenLobbyComponent extends BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  startSessionLabel = '';
  joinLobbyUrl = '';
  room_code: number;
  dialogRef;
  participants = [];
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  shareParticipantLink = '';
  hostname = window.location.host + '/participant/join?link=';

  constructor(
    private dialog: MatDialog,
    private contextService: ContextService,
    private utilsService: UtilsService
  ) {
    super();
  }

  openLowAttendanceDialog(): void {
    this.dialogRef = this.dialog
      .open(LowAttendanceDialogComponent, {
        data: {},
        disableClose: true,
        panelClass: 'low-response-dialog',
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  ngOnInit() {
    super.ngOnInit();
    this.room_code = this.activityState.lesson_run.lessonrun_code;
    this.shareParticipantLink = this.hostname + this.room_code;
    // this.sfxPlayer.nativeElement.play();
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.startSessionLabel = info.parameters.startSession;
        this.joinLobbyUrl = info.parameters.joinLobbyUrl;
      }
    });
  }

  ngOnChanges() {
    this.participants = this.activityState.lesson_run.participant_set;
  }

  ngOnDestroy() {
    // this.sfxPlayer.nativeElement.pause();
  }

  copyLink(val: string) {
    this.utilsService.copyToClipboard(val);
  }

  kickOffLesson() {
    // if (this.activityState.lesson_run.participant_set.length < 2) {
    //   this.openLowAttendanceDialog();
    // } else {
    this.sendMessage.emit(new LobbyStartButtonClickEvent());
    // }
  }

  setNicknameEvent() {
    this.sendMessage.emit(new LobbySetNicknameEvent({ nickname: 'ironman', user_id: 4 }));
  }
}
