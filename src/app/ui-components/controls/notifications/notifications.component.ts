import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { LessonRunNotification, Notification } from 'src/app/services/backend/schema/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'benji-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  @Input() avatarSize = 'large';
  @Input() isDashboard = true;

  @Input() notificationList: Array<Notification | LessonRunNotification> = [];
  @Input() activityState: UpdateMessage;
  @Input() participantCode: number;
  @Input() roomCode: string;

  @Output() updateNotificationCount = new EventEmitter<number>();
  @Output() markAsReadNotifications = new EventEmitter<Array<number>>();

  constructor(
    private notificationsService: NotificationService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    // Get all notfications at the start
    this.loadNotifications();
  }

  loadNotifications() {
    // get only unread notifications
    this.notificationsService.getNotifications(null).subscribe((notifications: Array<Notification>) => {
      if (this.notificationList.length === 0) {
        this.notificationList = notifications;
      }
      if (!this.isDashboard) {
        this.notificationList = this.notificationList.filter(
          (n) => n.extra.lessonrun_code === this.activityState?.lesson_run.lessonrun_code
        );
        this.updateNotificationCount.emit(this.notificationList.filter((x) => !x.read).length);
      }
    });
  }

  updateNotifications(notifications: Array<Notification | LessonRunNotification>) {
    this.notificationList = notifications;
    this.updateNotificationCount.emit(this.notificationList.filter((x) => !x.read).length);
  }

  getLessonName(notification: Notification): string {
    return notification?.extra?.lesson_name;
  }

  markAsRead(notification: Notification): void {
    if (this.isDashboard) {
      this.notificationsService.markAsRead(notification.id).subscribe((res: Notification) => {
        this.notificationList = this.notificationList.map((a) => {
          return a.id === res.id ? res : a;
        });
      });
    } else {
      const id = notification.id;
      notification.read = true;
      this.markAsReadNotifications.emit([id]);
      this.updateNotificationCount.emit(this.notificationList.filter((x) => !x.read).length);
    }
  }

  markAllAsRead(): void {
    if (this.isDashboard) {
      this.notificationsService.markAllasRead().subscribe((r: { message: string }) => {
        if (r.message === 'All notification is set to read successfully.') {
          this.loadNotifications();
        }
      });
    } else {
      const ids = this.notificationList.map((e) => {
        e.read = true;
        return e.id;
      });
      this.markAsReadNotifications.emit(ids);
      this.updateNotificationCount.emit(0);
    }
  }

  navigateToPost(notification: Notification): void {
    this.markAsRead(notification);
    this.router.navigate(['/screen/lesson/' + notification.extra.lessonrun_code], {
      queryParams: {
        board: notification.extra.board_id,
        post: notification.extra.idea_id,
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false,
      replaceUrl: true,
    });
  }

  getTime(notification: Notification): string {
    return this.utilsService.calculateTimeStamp(notification.created);
  }
}
