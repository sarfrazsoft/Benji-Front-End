import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'idea-creation-dialog',
  templateUrl: 'idea-creation.dialog.html',
})
export class IdeaCreationDialogComponent {
  constructor (
    private dialogRef: MatDialogRef<IdeaCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {img: string, description: string, name: string}) { 
    console.log(data)
  }
  
  onSubmit() {
    this.dialogRef.close("Use Template");
  }
}
