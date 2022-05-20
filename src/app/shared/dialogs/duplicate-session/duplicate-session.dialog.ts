import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-duplicate-session-dialog',
  templateUrl: 'duplicate-session.dialog.html',
})

export class DuplicateSessionDialogComponent {
  copyBoards = false;
  copyBoth = false;
  constructor(private dialogRef: MatDialogRef<DuplicateSessionDialogComponent>) {
  }

  updateCopyBoth(both: boolean) {
    if (both) {
      this.copyBoards = true;
      this.copyBoth = true;
    } else {
      this.copyBoth = false;
    }
  }

  confirm() {
    this.dialogRef.close([this.copyBoards, this.copyBoth]);
  }

}
