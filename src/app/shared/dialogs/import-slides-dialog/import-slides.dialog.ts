import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,  } from '@angular/material/dialog';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EditorService } from '../../../dashboard/editor/services/editor.service';

@Component({
  selector: 'import-slides-dialog',
  templateUrl: 'import-slides.dialog.html',
})
export class ImportSlidesDialogComponent {

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  lessonId;

  constructor (
    private editorService: EditorService,
    private dialogRef: MatDialogRef<ImportSlidesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {lessonID}) { 
    this.lessonId = data.lessonID;
  }
  
  closeImportDialog() {
    this.dialogRef.close();
  }

  uploadFile($event) {
    console.log($event.target.files[0]); // outputs the first file
    const file = $event.target.files[0];
    if (file) {
      this.editorService
        .uploadFile(file, this.lessonId)
        .pipe(
          map((res) => res),
            catchError((error) => error)
        )
        .subscribe((res) => {
          console.log(res);
        });
    }
    const url = '';
  }

}
