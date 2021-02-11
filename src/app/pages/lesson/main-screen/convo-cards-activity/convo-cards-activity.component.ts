import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-convo-cards-activity',
  templateUrl: './convo-cards-activity.component.html',
  styleUrls: ['./convo-cards-activity.component.scss'],
})
export class MainScreenConvoCardsActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges {
  speakers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  // speakers = [1, 2, 3, 4];
  constructor() {
    super();
  }

  ngOnInit(): void {}
  ngOnChanges() {}
}
