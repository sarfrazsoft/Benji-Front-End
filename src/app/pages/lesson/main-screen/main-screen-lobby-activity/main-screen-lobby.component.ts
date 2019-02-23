import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-lobby',
  templateUrl: './main-screen-lobby.component.html',
  styleUrls: ['./main-screen-lobby.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainScreenLobbyComponent extends BaseActivityComponent
  implements OnInit, OnDestroy {
  @ViewChild('sfxPlayer') sfxPlayer: ElementRef;

  ngOnInit() {
    this.sfxPlayer.nativeElement.play();
  }

  ngOnDestroy() {
    this.sfxPlayer.nativeElement.pause();
  }

  kickOffLesson() {
    this.sendMessage.emit({ event: 'start_button' });
  }
}
