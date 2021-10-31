import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-grouping-tool-dialog',
  templateUrl: 'grouping-tool.dialog.html',
})
export class GroupingToolDialogComponent {
  categories = ['Individual', 'Custom', 'Self-Assign']
  constructor(
    private dialogRef: MatDialogRef<GroupingToolDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { showCategoriesDropdown: boolean; categories: Array<Category> },
    private matDialog: MatDialog
  ) {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
