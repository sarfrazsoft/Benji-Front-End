import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ParticipantGroupingDialogComponent } from '../shared/dialogs/participant-grouping-dialog/participant-grouping.dialog';
import { ParticipantGroupingInfoDialogComponent } from '../shared/dialogs/participant-grouping-info-dialog/participant-grouping-info.dialog';
import { UpdateMessage } from './backend/schema';

@Injectable()
export class SharingToolService {
  /**
   * Setting change
   */
  sharingToolControl$ = new BehaviorSubject<any>(null);

  set sharingToolControl(lesson: UpdateMessage) {
    this.sharingToolControl$.next(lesson);
  }
  get sharingToolControl(): UpdateMessage {
    return this.sharingToolControl$.getValue();
  }
  constructor(private matDialog: MatDialog) {}

  sendMessage$ = new BehaviorSubject<any>(null);

  set sendMessage(lesson: UpdateMessage) {
    this.sendMessage$.next(lesson);
  }
  get sendMessage(): UpdateMessage {
    return this.sendMessage$.getValue();
  }

  participantGroupingToolDialogRef: MatDialogRef<ParticipantGroupingDialogComponent>;
  participantGroupingInfoDialogRef: MatDialogRef<ParticipantGroupingInfoDialogComponent>;
}
