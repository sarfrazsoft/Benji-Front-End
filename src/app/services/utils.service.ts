import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../ui-components/snack-bar-component/snack-bar.component';
@Injectable()
export class UtilsService {
  notificationConfig: MatSnackBarConfig = {
    duration: 5000,
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

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  openSnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action, {
      duration: 5000,
      panelClass: ['bg-success-color', 'white-color', 'simple-snack-bar'],
    });
  }

  openWarningNotification(message: string, action: string) {
    return this.matSnackBar.openFromComponent(SnackBarComponent, {
      data: {
        text: message,
        dismissText: 'uh-oh',
        actionButtonText: '',
        icon: 'warningNotificationIcon.svg',
      },
      panelClass: ['snackbar-notification', 'success'],
      ...this.notificationConfig,
    });
  }
  openSuccessNotification(message: string, action: string) {
    return this.matSnackBar.openFromComponent(SnackBarComponent, {
      data: {
        text: message,
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

  openTimerComplete() {
    return this.matSnackBar.openFromComponent(SnackBarComponent, {
      data: {
        text: 'Timer is done!',
        dismissText: 'Okay',
        actionButtonText: 'Reset Timer',
        icon: 'timerNotificationIcon.svg',
      },
      panelClass: ['snackbar-notification', 'info'],
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

  // showWarning(message: string) {
  //   this.matSnackBar.open(`${message}`, 'close', {
  //     duration: 5000,
  //     panelClass: ['bg-warning-color', 'white-color'],
  //   });
  // }

  resizeImage = (settings: IResizeImageOptions) => {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');
    const dataURItoBlob = (dataURI: string) => {
      const bytes =
        dataURI.split(',')[0].indexOf('base64') >= 0
          ? atob(dataURI.split(',')[1])
          : unescape(dataURI.split(',')[1]);
      const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);
      for (let i = 0; i < max; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ia], { type: mime });
    };
    const resize = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      return dataURItoBlob(dataUrl);
    };

    return new Promise((ok, no) => {
      if (!file.type.match(/image.*/)) {
        no(new Error('Not an image'));
        return;
      }

      reader.onload = (readerEvent: any) => {
        image.onload = () => ok(resize());
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
}

export interface IResizeImageOptions {
  maxSize: number;
  file: File;
}
