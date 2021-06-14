import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'templates-dialog',
  templateUrl: 'templates.dialog.html',
})
export class TemplatesDialogComponent {
  constructor (
    private dialogRef: MatDialogRef<TemplatesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {img: string, description: string, name: string}) { 
    console.log(data)
  }
  
  onSubmit() {
    this.dialogRef.close("Use Template");
  }
}
