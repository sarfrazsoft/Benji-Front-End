import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'benji-notifications-list',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {

  @Input() avatarSize = "large";
  @Input() isDashboard = true;

  activities = [
    {
      name: "Eduardo V",
      activity: "commented on your post in",
      board: "Team Hang",
      time: "6 days ago"
    },
    {
      name: "Mahin",
      activity: "Invited you to the session",
      board: "Session 3",
      time: "6 days ago"
    },
    {
      name: "Muhammad Sarfraz",
      activity: "commented on your post in",
      board: "Team Hang",
      time: "6 days ago"
    }
  ];
  
  constructor() {}

  ngOnInit() {}

}
