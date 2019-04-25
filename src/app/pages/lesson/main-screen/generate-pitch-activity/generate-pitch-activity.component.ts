import { Component, OnInit } from '@angular/core';

import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-generate-pitch-activity',
  templateUrl: './generate-pitch-activity.component.html',
  styleUrls: ['./generate-pitch-activity.component.scss']
})
export class MainScreenGeneratePitchActivityComponent
  extends BaseActivityComponent
  implements OnInit {
  splitIntoGroups = false;
  timeToPitch = false;
  shareFeedback = true;

  userList1 = [
    { name: 'Omar', found: false },
    { name: 'Reagon', found: true },
    { name: 'Emily', found: false }
  ];
  userList2 = [
    { name: 'Polly', found: false },
    { name: 'Harold', found: false },
    { name: 'Marie-Ann', found: true }
  ];

  constructor() {
    super();
  }

  ngOnInit() {}
}
