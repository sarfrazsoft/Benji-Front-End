import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-mainscreen-footer',
  templateUrl: './main-screen-footer.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MainScreenFooterComponent {
  @Input() public showProgress: boolean;
  @Input() public completed: number;
  @Input() public total: number;
  @Input() public statusText: string;
  @Input() sessionName: string;
  @Input() roomCode: number;

  constructor() { }
}
