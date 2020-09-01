import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-reorder-activity',
  templateUrl: './reorder-activity.component.html',
  styleUrls: ['./reorder-activity.component.scss'],
})
export class ParticipantReorderActivityComponent extends BaseActivityComponent implements OnInit {
  items = [
    {
      id: 1,
      text: '1',
    },
    {
      id: 2,
      text: '2',
    },
    {
      id: 3,
      text: '3',
    },
    {
      id: 4,
      text: '4',
    },
    {
      id: 5,
      text: '5',
    },
    {
      id: 6,
      text: '6',
    },
  ];
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  drop(event: CdkDragDrop<string[]>) {
    // if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // } else {
    // transferArrayItem(
    //   event.previousContainer.data,
    //   event.container.data,
    //   event.previousIndex,
    //   event.currentIndex
    // );
    // }
  }
}
