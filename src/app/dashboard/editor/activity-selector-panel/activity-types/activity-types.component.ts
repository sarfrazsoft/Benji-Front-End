import { Component, OnInit } from '@angular/core';

const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];

@Component({
  selector: 'benji-activity-types',
  templateUrl: './activity-types.component.html',
  styleUrls: ['./activity-types.component.scss'],
})
export class ActivityTypesComponent implements OnInit {
  activityTypes = [
    {
      id: 1,
      type: 'Popular question types',
      mouseOvered: false,
      activities: [
        { displayName: 'Multiple Choice', id: 1 },
        { displayName: 'Scales', id: 2 },
        { displayName: 'Q&A', id: 3 },
        { displayName: 'Ranking', id: 4 },
        { displayName: 'Type Answer', id: 5 },
      ],
    },
    {
      id: 2,
      type: 'Quiz Competition',
      mouseOvered: false,
      activities: [
        { displayName: 'Multiple Choice', id: 6 },
        { displayName: 'Scales', id: 7 },
      ],
    },
    {
      id: 3,
      type: 'Content Sliders',
      mouseOvered: false,
      activities: [
        { displayName: 'Heading', id: 8 },
        { displayName: 'Paragraph', id: 9 },
        { displayName: 'Image slide', id: 10 },
        { displayName: 'Big', id: 11 },
      ],
    },
  ];
  constructor() {}

  ngOnInit() {}

  mouseOver(activityId: number) {
    // dispatch event to store
    // activity.mouseOvered = true
  }

  mouseOut(activityId: number) {
    // dispatch event to store
    // activity.mouseOvered = false
  }
}
