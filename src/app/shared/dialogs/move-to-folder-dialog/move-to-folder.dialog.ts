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
  isNewFolder: boolean;

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

  newFolderClicked() {
    this.isNewFolder = true;
    this.newFolder(true);
  }

  newFolder(isNew: boolean, folderId?: number) {
    const folder = this.folders.filter(x => x.id === folderId);
    this.dialog
      .open(NewFolderDialogComponent, {
        data: {
          newFolder: isNew,
          title: folder[0]?.name,
        },
        panelClass: 'new-folder-dialog',
      })
      .afterClosed()
      .subscribe((folder: FolderInfo) => {
        if (folder) {
          let request = isNew ?
            this.lessonGroupService.createNewFolder(folder) :
            this.lessonGroupService.updateFolder({ title: folder.title, id: folderId, lessonsIds: null });
          request.subscribe(
            (data) => {
              this.getAllFolders();
              if (isNew) {
                this.contextService.newFolderAdded = true;
              }
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
