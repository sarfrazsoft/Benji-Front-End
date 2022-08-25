import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LessonGroupService } from 'src/app/services/lesson-group.service';
@Component({
  selector: 'benji-move-to-folder-dialog',
  templateUrl: 'move-to-folder.dialog.html',
})
export class MoveToFolderDialogComponent implements OnInit {
  form: FormGroup;
  focusTitle;
  showEdit: boolean;
  isNewFolder = false;
  selectedFolderId: number;
  folderName: string;

  folders = [ ];
  
  constructor(
    private lessonGroupService: LessonGroupService,
    private dialogRef: MatDialogRef<MoveToFolderDialogComponent>,
    private builder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.builder.group({
      title: new FormControl('', [Validators.required]),
    });
    this.getAllFolders();
  }

  getAllFolders() {
    this.lessonGroupService.getAllFolders()
    .subscribe(
      (data) => {
        this.folders = data;
      },
      (error) => console.log(error)
    );
  }

  get title(): AbstractControl {
    return this.form.get('title');
  }

  moveToFolder(folder) {
    this.selectedFolderId = folder.id;
    this.folderName = folder.name;
    this.isNewFolder = false;
  }

  newFolderClicked() {
    this.isNewFolder = true;
  }
  
  onSubmit(): void {
    if (this.isNewFolder && this.form.valid) {
      const val = this.form.value;
      this.dialogRef.close({
        title: val.title
      });
    } else {
      this.dialogRef.close({
        id: this.selectedFolderId,
        name: this.folderName
      });
    }
  }

}
