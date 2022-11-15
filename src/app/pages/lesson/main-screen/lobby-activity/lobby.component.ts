import { HttpClient } from '@angular/common/http';
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
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { LobbySetNicknameEvent, LobbyStartButtonClickEvent } from 'src/app/services/backend/schema';
import { BeforeLessonRunDetails } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-lobby',
  templateUrl: './lobby.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MainScreenLobbyComponent extends BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  public beforeLessonRunDetails: BeforeLessonRunDetails;
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
    private utilsService: UtilsService,
    private http: HttpClient
  ) {
    super();
  }

  openLowAttendanceDialog(): void {
    // this.dialogRef = this.dialog
    //   .open(LowAttendanceDialogComponent, {
    //     data: {},
    //     disableClose: true,
    //     panelClass: 'low-response-dialog',
    //   })
    //   .afterClosed()
    //   .subscribe((res) => {});
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
    this.updateBeforeLessonRunDetails();
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

  kickOffLesson(msg) {
    // if (this.activityState.lesson_run.participant_set.length < 2) {
    //   this.openLowAttendanceDialog();
    // } else {
    if (msg === 'startLesson') {
      this.sendMessage.emit(new LobbyStartButtonClickEvent());
    }
    // }
  }

  setNicknameEvent() {
    this.sendMessage.emit(new LobbySetNicknameEvent({ nickname: 'ironman', user_id: 4 }));
  }

  getBeforeLessonRunDetails(lessonrun_code) {
    const request = global.apiRoot + '/course_details/lesson_run/' + lessonrun_code + '/lessonrun_details/';
    return this.http.post(request, {});
  }

  updateBeforeLessonRunDetails() {
    this.getBeforeLessonRunDetails(this.room_code).subscribe((res: BeforeLessonRunDetails) => {
      this.beforeLessonRunDetails = res;
    });
  }
}
