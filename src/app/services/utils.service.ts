import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { SnackBarComponent } from '../ui-components/snack-bar-component/snack-bar.component';
import { environment } from 'src/environments/environment';
@Injectable()
export class UtilsService {
  notificationConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  };
  constructor(
    protected matSnackBar: MatSnackBar,
    private title: Title,
  ) {}

  setDefaultPageTitle() {
    this.title.setTitle('Benji');
  }

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
    this.openSuccessNotification('copied to clipboard', '');
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
      // const dataUrl = canvas.toDataURL('image/jpeg');
      const dataUrl = canvas.toDataURL('image');
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


  calculateTimeStamp(time: string) {
    let timeStamp = '';
    // Test string
    // timeStamp = moment('Thu May 09 2022 17:32:03 GMT+0500').fromNow().toString();
    // timeStamp = moment('Thu Oct 25 1881 17:30:03 GMT+0300').fromNow().toString();
    if (!time) {
      return;
    }
    timeStamp = moment(time).fromNow().toString();
    if (timeStamp === 'a few seconds ago' || timeStamp === 'in a few seconds') {
      timeStamp = '1m ago';
    } else if (timeStamp.includes('an hour ago')) {
      timeStamp = '1hr ago';
    } else if (timeStamp.includes('a minute ago')) {
      timeStamp = '1m ago';
    } else if (timeStamp.includes('minutes')) {
      timeStamp = timeStamp.replace(/\sminutes/, 'm');
    } else if (timeStamp.includes('hours')) {
      timeStamp = timeStamp.replace(/\shours/, 'hr');
    } else if (timeStamp.includes('days')) {
      timeStamp = timeStamp.replace(/\sdays/, 'd');
    } else if (timeStamp.includes('a month')) {
      timeStamp = timeStamp.replace(/a month/, '1mo');
    } else if (timeStamp.includes('months')) {
      timeStamp = timeStamp.replace(/\smonths/, 'mo');
    } else if (timeStamp.includes('a year')) {
      timeStamp = timeStamp.replace(/a year/, '1yr');
    } else if (timeStamp.includes('years')) {
      timeStamp = timeStamp.replace(/\syears/, 'yr');
    }
    return timeStamp;
  }

  goToStripe(userEmail: string, userId: number) {
    document.location.href = environment.stripe + '?prefilled_email=' + userEmail + '&client_reference_id=' + userId;
  }
}

export interface IResizeImageOptions {
  maxSize: number;
  file: File;
}