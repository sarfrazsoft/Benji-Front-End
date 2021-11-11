import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  openParticipantGroupingInfoDialog(activityState: UpdateMessage) {
    const state = activityState;
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
        this.openParticipantGroupingToolDialog(state);
      }
    });
    return dialogRef;
  }

  openParticipantGroupingToolDialog(activityState: UpdateMessage) {
    const dialogRef = this.matDialog.open(ParticipantGroupingDialogComponent, {
      panelClass: 'grouping-participant-info-dialog',
      data: {
        activityState: activityState,
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
}
