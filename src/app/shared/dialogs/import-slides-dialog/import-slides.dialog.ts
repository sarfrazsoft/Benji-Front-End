import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'import-slides-dialog',
  templateUrl: 'import-slides.dialog.html',
})
export class ImportSlidesDialogComponent {
  constructor (
    private dialogRef: MatDialogRef<ImportSlidesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {img: string, description: string, name: string}) { 
    console.log(data)
  }
  
  onSubmit() {
    this.dialogRef.close("Use Template");
  }
}
