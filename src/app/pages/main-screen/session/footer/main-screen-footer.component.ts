import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-desktop-footer',
  template:
    '<div class="screen-footer">\n' +
    '    <div class="footer-left-wrap">\n' +
    '      <div class="users-submitted" *ngIf="showProgress">\n' +
    '        <div class="number-text">{{ completed }}/{{ total }}</div>\n' +
    '        <div class="text-block-2">{{ statusText }}</div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="footer-right-wrap">\n' +
    '      <div class="footer-text-wrap-left">\n' +
    '        <div class="dark-blue-footer-text">{{ sessionName }}</div>\n' +
    '      </div>\n' +
    '      <div class="footer-text-wrap">\n' +
    '        <div class="grey-footer-text">room code:  </div>\n' +
    '        <div class="dark-blue-footer-text">{{ roomCode }}</div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopFooterComponent {
  @Input() public showProgress: boolean;
  @Input() public completed: number;
  @Input() public total: number;
  @Input() public statusText: string;
  @Input() sessionName: string;
  @Input() roomCode: number;

  constructor() { }
}
