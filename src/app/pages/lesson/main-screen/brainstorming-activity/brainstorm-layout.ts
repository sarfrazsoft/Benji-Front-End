import { Directive } from '@angular/core';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class BrainstormLayout {
  ideaDetailedDialogOpen = false;

  ideaDetailedDialogOpened(): void {
    this.ideaDetailedDialogOpen = true;
  }
  ideaDetailedDialogClosed(): void {
    this.ideaDetailedDialogOpen = false;
  }
}
