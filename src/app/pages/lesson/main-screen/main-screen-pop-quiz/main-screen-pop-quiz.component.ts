import { Component, OnChanges, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-main-screen-pop-quiz',
  templateUrl: './main-screen-pop-quiz.component.html',
  styleUrls: ['./main-screen-pop-quiz.component.scss']
})
export class MainScreenPopQuizComponent extends BaseActivityComponent
  implements OnInit, OnChanges {
  constructor() {
    super();
  }

  optionIdentifiers = ['A', 'B', 'C', 'D'];

  ngOnInit() {
    console.log(this.activityState);
  }

  ngOnChanges() {}
}
