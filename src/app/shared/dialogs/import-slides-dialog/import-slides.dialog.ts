import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'import-slides-dialog',
  templateUrl: 'import-slides.dialog.html',
})
export class ImportSlidesDialogComponent {

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;

  constructor (
    private dialogRef: MatDialogRef<ImportSlidesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {img: string, description: string, name: string}) { 
    console.log(data)
  }
  
  closeImportDialog() {
    this.dialogRef.close();
  }
}
