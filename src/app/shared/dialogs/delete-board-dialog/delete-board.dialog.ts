import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'benji-delete-board-dialog',
  templateUrl: 'delete-board.dialog.html'
})
export class DeleteBoardDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteBoardDialogComponent>,
  ) {}


  public deleteBoard() {
    this.dialogRef.close({});
  }

  public cancel() {
    this.dialogRef.close();
  }
  
}
