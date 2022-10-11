import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContextService } from 'src/app/services';
import { Folder, FolderInfo, LessonGroupService, MoveToFolderData } from 'src/app/services/lesson-group.service';
import { NewFolderDialogComponent } from '..';
@Component({
  selector: 'benji-move-to-folder-dialog',
  templateUrl: 'move-to-folder.dialog.html',
})
export class MoveToFolderDialogComponent implements OnInit {
  folders: Array<Folder> = [];
  lessonFolders: Array<number> = [];

  constructor(
    private lessonGroupService: LessonGroupService,
    private contextService: ContextService,
    private dialogRef: MatDialogRef<MoveToFolderDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: MoveToFolderData,
  ) {
    this.folders = data.folders;
    this.lessonFolders = data.lessonFolders;
  }

  ngOnInit() {
  }

  getAllFolders() {
    this.lessonGroupService.getAllFolders()
      .subscribe(
        (data: Array<Folder>) => {
          this.folders = data;
        },
        (error) => console.log(error)
      );
  }

  valueChange(folder: Folder, $event) {
    if ($event.checked) {
      if (!this.lessonFolders.includes(folder.id)) {
        this.lessonFolders.push(folder.id);
      }
    }
    else {
      this.lessonFolders = this.lessonFolders.filter(id => id != folder.id);
    }
  }

  newFolder() {
    this.dialog
      .open(NewFolderDialogComponent, {
        data: {
          newFolder: true,
        },
        panelClass: 'new-folder-dialog',
      })
      .afterClosed()
      .subscribe((folder: FolderInfo) => {
        if (folder) {
          this.lessonGroupService.createNewFolder(folder).subscribe(
            (data) => {
              this.getAllFolders();
              this.contextService.newFolderAdded = true;
            },
            (error) => console.log(error)
          );
        }
      });
  }

  onSubmit(): void {
    this.dialogRef.close({
      lessonFolders: this.lessonFolders,
    });
  }

}
