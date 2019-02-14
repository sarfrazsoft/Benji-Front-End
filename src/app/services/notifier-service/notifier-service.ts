import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

export enum NotifierStatus {
  success = 'benji-snack-success',
  info = 'benji-snack-info',
  warning = 'benji-snack-warning',
  error = 'benji-snack-error'
}

@Injectable()
export class NotifierService {
  private duration: number;

  constructor(private snackbar: MatSnackBar) {
    this.duration = 45000;
  }

  // TODO remove any and use an specific ComponentType
  snackFromComponent(component: any, duration = null): void {
    this.snackbar.openFromComponent(component, {
      duration: duration ? duration : this.duration
    });
  }

  snack(
    message: string,
    action = '',
    duration = null,
    status: NotifierStatus
  ): void {
    if (!message) {
      return;
    }

    const show = (msg: string) => {
      this.snackbar.open(msg, action, {
        duration: duration ? duration : this.duration,
        panelClass: [status]
      });
    };
    // direct error messages
    show(message);
  }

  success(message, action = '', duration = null): void {
    this.snack(message, action, duration, NotifierStatus.success);
  }

  info(message, action = '', duration = null): void {
    this.snack(message, action, duration, NotifierStatus.info);
  }

  warning(message, action = '', duration = null): void {
    this.snack(message, action, duration, NotifierStatus.warning);
  }

  error(message, action = '', duration = null): void {
    this.snack(message, action, duration, NotifierStatus.error);
  }
}
