import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ParticipantGroupingDialogComponent } from '../shared/dialogs/participant-grouping-dialog/participant-grouping.dialog';
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

  openParticipantGroupingToolDialog(activityState: UpdateMessage) {
    const dialogRef = this.matDialog.open(ParticipantGroupingDialogComponent, {
      panelClass: 'grouping-participant-dialog',
      data: {
        activityState: activityState,
      },
    });

    const sub = dialogRef.componentInstance.sendMessage.subscribe((event) => {
      this.sendMessage$.next(event);
    });

    // this.dialogRef.afterClosed().subscribe((result) => {
    //   sub.unsubscribe();
    //   if (result === 'Use Template') {
    //   }
    //   console.log(`Dialog result: ${result}`);
    // });
    return dialogRef;
  }
}
