import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../ui-components/snack-bar-component/snack-bar.component';
@Injectable()
export class UtilsService {
  notificationConfig: MatSnackBarConfig = {
    duration: 300000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
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

  openSubmissionComplete(message: string, action: string) {
    return this.matSnackBar.openFromComponent(SnackBarComponent, {
      data: {
        text: 'All votes are in! ',
        dismissText: 'Okay',
        actionButtonText: '',
        icon: 'successNotificationIcon.svg',
      },
      panelClass: ['snackbar-notification', 'success'],
      ...this.notificationConfig,
    });
    // .onAction()
    // .subscribe(() => {
    //   console.log('Action button clicked!');
    // });
    // return this.matSnackBar.open(message, action, {
    //   duration: 300000,
    //   panelClass: ['bg-success-color', 'white-color', 'simple-snack-bar'],
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    // });
  }

  showWarning(message: string) {
    this.matSnackBar.open(`${message}`, 'close', {
      duration: 5000,
      panelClass: ['bg-warning-color', 'white-color'],
    });
  }
}
