import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextService } from 'src/app/services';
import { LobbyStartButtonClickEvent } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-su-lobby-activity',
  templateUrl: './lobby-activity.component.html',
  styleUrls: ['./lobby-activity.component.scss']
})
export class SingleUserLobbyActivityComponent extends BaseActivityComponent
  implements OnInit {
  @Output() startClicked = new EventEmitter();
  lessonName = '';
  startSessionLabel = '';

  constructor(private contextService: ContextService) {
    super();
  }

  ngOnInit() {
    this.lessonName = this.activityState.lesson.lesson_name;
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.startSessionLabel = info.parameters.startSession;
      }
    });
  }

  kickOffLesson() {
    this.sendMessage.emit(new LobbyStartButtonClickEvent());
  }
}
