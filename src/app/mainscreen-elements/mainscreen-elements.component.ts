// TODO figure me out, I'm not being used anywhere

import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-mainscreen-elements',
  templateUrl: './mainscreen-elements.component.html',
  styleUrls: ['./mainscreen-elements.component.scss']
})
export class MainscreenElementsComponent implements OnInit {
  public countdown = 0;
  public countdownInterval;

  ngOnInit() {
    this.countdownInterval = interval(100).subscribe(() => {
      ++this.countdown;
    });
  }
}
