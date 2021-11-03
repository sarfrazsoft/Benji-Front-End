import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'benji-grouping-collaborate-dialog',
  templateUrl: 'grouping-collaborate.dialog.html',
})
export class GroupingCollaborateDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<GroupingCollaborateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private matDialog: MatDialog,
  ) {
    
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
