import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'templates-dialog',
  templateUrl: 'templates.dialog.html',
})
export class TemplatesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {img: string, description: string, name: string}) { 
    console.log(data)
  }
}
