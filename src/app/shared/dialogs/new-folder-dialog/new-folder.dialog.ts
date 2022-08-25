import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { Lesson } from 'src/app/services/backend/schema/course_details';
@Component({
  selector: 'benji-new-folder-dialog',
  templateUrl: 'new-folder.dialog.html',
})
export class NewFolderDialogComponent implements OnInit {
  form: FormGroup;
  focusTitle;
  focusDescription;
  newFolder: boolean;
  showEdit: boolean;
  
  hostLocation = window.location.host;

  constructor(
    private httpClient: HttpClient,
    private dialogRef: MatDialogRef<NewFolderDialogComponent>,
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  selectedSession;

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('', [Validators.required]),
    });
    
    if (this.data.title) {
      this.form.setValue({ title: this.data.title });
    }

    if (this.data.newFolder) {
      this.newFolder = this.data.newFolder;
    }
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  renameFolder(name: string, id): Observable<any[]> {
    return this.httpClient.patch<any[]>(global.apiRoot + `/course_details/lesson/${id}/`, name);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      this.dialogRef.close({
        title: val.title
      });
    }
  }
}
