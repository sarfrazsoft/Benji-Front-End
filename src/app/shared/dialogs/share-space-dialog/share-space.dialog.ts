import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnChanges, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
export interface dialogData {
  id: number;
  title: string;
  link: string;
  activityState: UpdateMessage;
  participants: Array<ParticipantsData>;
}
export interface ParticipantsData {
  name: string;
  about: string;
  role?: string,
  participant_code?: number;
}
@Component({
  selector: 'benji-share-space-dialog',
  templateUrl: 'share-space.dialog.html',
})
export class ShareSpaceDialogComponent implements OnInit {

  hostLocation = environment.web_protocol + '://' + environment.host;
  spaceTitle: string;
  activityState: UpdateMessage;
  shareParticipantLink: string;

  bootParticipantEvent = new EventEmitter();

  constructor(
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<ShareSpaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData
  ) {}
  selectedSession;

  ngOnInit() {
    this.spaceTitle = this.data.title;
    this.activityState = this.data.activityState;
    this.shareParticipantLink = this.data.link;
  }

  updateAccessLevel(id): Observable<any[]> {
    return this.httpClient.patch<any[]>(global.apiRoot + `/course_details/lesson/${id}/`, id);
  }

  onSubmit(): void {
    this.updateAccessLevel(this.data.id)
      .pipe(
        map((res) => res),
        catchError((error) => error)
      )
      .subscribe((res: Lesson) => {
        this.dialogRef.close();
      });
  }

  copyLink() {
    this.utilsService.copyToClipboard(this.shareParticipantLink);
  }

  bootParticipant(participantCode: number) {
    this.bootParticipantEvent.emit(participantCode);
  }

}
