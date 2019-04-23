import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { LobbyStartButtonClickEvent } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
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
    this.sendMessage.emit(new LobbyStartButtonClickEvent());
  }
}
