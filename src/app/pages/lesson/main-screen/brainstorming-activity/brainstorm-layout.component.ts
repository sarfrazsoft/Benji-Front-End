import { Directive, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class BrainstormLayoutComponent {
  ideaDetailedDialogOpen = false;

  ideaDetailedDialogOpened(): void {
    this.ideaDetailedDialogOpen = true;
  }
  ideaDetailedDialogClosed(): void {
    this.ideaDetailedDialogOpen = false;
  }
}
