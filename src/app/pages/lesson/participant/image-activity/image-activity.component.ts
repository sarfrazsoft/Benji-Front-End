import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-image-activity',
  templateUrl: './image-activity.component.html',
  styleUrls: ['./image-activity.component.scss'],
})
export class ParticipantImageActivityComponent extends BaseActivityComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
