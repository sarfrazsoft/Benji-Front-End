import { Component, OnInit } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-main-screen-pop-quiz',
  templateUrl: './main-screen-pop-quiz.component.html',
  styleUrls: ['./main-screen-pop-quiz.component.scss']
})
export class MainScreenPopQuizComponent extends BaseActivityComponent
  implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
