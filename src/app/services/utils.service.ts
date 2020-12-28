import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class UtilsService {
  constructor(protected matSnackBar: MatSnackBar) {}

  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar('copied to clipboard', '');
  }

  openSnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action, {
      duration: 5000,
      panelClass: ['bg-success-color', 'white-color', 'simple-snack-bar'],
    });
  }

  showWarning(message: string) {
    this.matSnackBar.open(`${message}`, 'close', {
      duration: 5000,
      panelClass: ['bg-warning-color', 'white-color'],
    });
  }
}
