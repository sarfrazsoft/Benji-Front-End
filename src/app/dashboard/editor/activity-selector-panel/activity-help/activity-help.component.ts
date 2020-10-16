import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'benji-activity-help',
  templateUrl: './activity-help.component.html',
  styleUrls: ['./activity-help.component.scss'],
})
export class ActivityHelpComponent implements OnInit {
  activityHelp = ActivityHelp;
  constructor() {}

  ngOnInit() {}
}

export const ActivityHelp = [
  {
    type: 'header',
    content: 'Overview',
  },
  {
    type: 'paragraph',
    content: `Our multiple choice activity works just as you’d expect.
              Ask your participants a question and they have
              to pick the correct answer. You select which questions are right.`,
  },
  {
    type: 'paragraph',
    content: `If you pick multiple correct answers then
              they have to pick all that are correct. Here’s a video walking
              you through this!`,
  },
  {
    type: 'image',
    content: '/assets/img/helpimg.png',
  },
  {
    type: 'header',
    content: 'Tips',
  },
];
