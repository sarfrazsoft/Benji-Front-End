import { Component, OnChanges } from '@angular/core';
import { ContextService } from 'src/app/services';
import {
  LobbyStartButtonClickEvent,
  Timer,
} from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class ParticipantLobbyComponent extends BaseActivityComponent
  implements OnChanges {
  singleUserActivity;
  constructor(private contextService: ContextService) {
    super();
  }
  ngOnChanges() {
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    this.singleUserActivity = this.activityState.lesson.single_user_lesson;
  }
  kickOffLesson() {
    this.sendMessage.emit(new LobbyStartButtonClickEvent());
  }
}
