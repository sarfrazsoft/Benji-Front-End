// TODO figure me out, I'm not being used anywhere

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent {
  constructor(public dialog: MatDialog) {}

  public triggerDialogue(templateRef) {
    this.dialog.open(templateRef, {
      width: '305px',
      panelClass: 'dialog--indigo-blue'
    });
  }
}
