import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-gather-activity',
  templateUrl: './gather-activity.component.html',
  styleUrls: ['./gather-activity.component.scss'],
})
export class ParticiapantGatherActivityComponent extends BaseActivityComponent
  implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
