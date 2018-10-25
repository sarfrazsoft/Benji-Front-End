import { Component, OnInit, TemplateRef, ElementRef, ViewChild, Inject } from '@angular/core';
import {MatDialog} from '@angular/material';

declare var twemoji: any;


@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent implements OnInit {

  constructor(public dialog: MatDialog) {

  }

  ngOnInit() {

  }

  public triggerDialogue(templateRef) {
    this.dialog.open(templateRef, {
      width: '305px',
      panelClass: 'dialog--indigo-blue'
    });
  }



}
