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

  openParticipantGroupingInfoDialog(activityState: UpdateMessage, participantCode: number) {
    const state = activityState;
    const pCode = participantCode;
    const dialogRef = this.matDialog.open(ParticipantGroupingInfoDialogComponent, {
      panelClass: 'grouping-participant-info-dialog',
      data: {
        activityState: activityState,
      },
    });

    // const sub = dialogRef.componentInstance.sendMessage.subscribe((event) => {
    //   this.sendMessage$.next(event);
    // });

    dialogRef.afterClosed().subscribe((result) => {
      // sub.unsubscribe();
      if (result === 'openDialog') {
        this.participantGroupingToolDialogRef = this.openParticipantGroupingToolDialog(state, pCode);
      }
    });
    this.participantGroupingInfoDialogRef = dialogRef;
    return dialogRef;
  }

  openParticipantGroupingToolDialog(activityState: UpdateMessage, pCode: number) {
    const dialogRef = this.matDialog.open(ParticipantGroupingDialogComponent, {
      panelClass: 'participant-grouping-dialog',
      data: {
        activityState: activityState,
        participantCode: pCode,
      },
    });

    const sub = dialogRef.componentInstance.sendMessage.subscribe((event) => {
      this.sendMessage$.next(event);
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   // sub.unsubscribe();
    //   if (result === 'openDialog') {
    //   }
    // });
    return dialogRef;
  }

  updateParticipantGroupingToolDialog(groupingTool) {
    if (this.participantGroupingToolDialogRef && this.participantGroupingToolDialogRef.componentInstance) {
      this.participantGroupingToolDialogRef.componentInstance.updateGroupingInfo(groupingTool);
    }
  }

  updateParticipantGroupingInfoDialog(groupingTool) {
    if (this.participantGroupingInfoDialogRef && this.participantGroupingInfoDialogRef.componentInstance) {
      this.participantGroupingInfoDialogRef.componentInstance.updateGroupingInfo(groupingTool);
    }
  }
}
