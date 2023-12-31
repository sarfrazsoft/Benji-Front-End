import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EventTypes, UpdateMessage } from 'src/app/services/backend/schema';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { BootParticipantEvent } from 'src/app/services/backend/schema/messages';
import {
  ParticipantsData,
  ShareSpaceDialogComponent,
} from 'src/app/shared/dialogs/share-space-dialog/share-space.dialog';

@Component({
  selector: 'benji-share-lesson-link',
  templateUrl: './share-link.component.html',
})
export class ShareLinkComponent implements OnInit, OnChanges {
  @Input() activityState: UpdateMessage;
  @Input() participantCode: number;
  @Input() lesson: Lesson;
  @Input() roomCode: string;

  @Output() socketMessage = new EventEmitter<any>();

  oldActivityState: UpdateMessage;

  hostname = window.location.host + '/participant/join?link=';
  shareParticipantLink = '';
  participants: Array<ParticipantsData>;
  shareLinkDialogRef: MatDialogRef<ShareSpaceDialogComponent>;

  constructor(private matDialog: MatDialog) {}

  ngOnInit() {
    this.shareParticipantLink = this.hostname + this.roomCode;
    if (!this.hostname.includes('localhost')) {
      this.hostname = 'https://' + this.hostname;
    }
  }

  ngOnChanges() {
    if (
      this.activityState.eventType === EventTypes.joinEvent ||
      this.activityState.eventType === EventTypes.bootParticipantEvent
    ) {
      this.setParticipantsData();
      this.oldActivityState = this.activityState;
    }
  }

  openShareLinkDialog() {
    this.shareLinkDialogRef = this.matDialog.open(ShareSpaceDialogComponent, {
      data: {
        id: this.lesson.id,
        title: this.lesson.lesson_name,
        link: this.shareParticipantLink,
        participants: this.participants,
        activityState: this.oldActivityState,
      },
      panelClass: 'share-space-dialog',
    });

    const sub = this.shareLinkDialogRef.componentInstance.bootParticipantEvent.subscribe(
      (participantCode: number) => {
        this.socketMessage.emit(new BootParticipantEvent(participantCode));
      }
    );
  }

  setParticipantsData() {
    this.participants = [];
    const host = this.activityState.lesson_run.host;
    this.participants.push({
      name: host.first_name + ' ' + host.last_name,
      about: host.email,
      role: 'Host',
    });
    this.activityState.lesson_run.participant_set.forEach((p) => {
      if (p.is_active) {
        this.participants.push({
          name: p.display_name,
          about: p.email,
          role: 'Participant',
          participant_code: p.participant_code,
        });
      }
    });
    if (this.shareLinkDialogRef && this.shareLinkDialogRef.componentInstance) {
      this.shareLinkDialogRef.componentInstance.data.participants = this.participants;
    }
  }
}
