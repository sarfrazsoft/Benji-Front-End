import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'benji-delete-board-dialog',
  templateUrl: 'delete-board.dialog.html'
})
export class DeleteBoardDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}


  public deleteBoard() {
    this.dialogRef.close({delete: true});
  }

  public cancel() {
    this.dialogRef.close();
  }
  
}
