import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { filter, find, findIndex, noop, remove } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, Subscription } from 'rxjs';
import { ContextService } from 'src/app/services';
import { LeaderBoard, MCQActivity, MCQChoiceSet, ParticipantRanks } from 'src/app/services/backend/schema';
import { MCQChoice, MCQSubmitAnswerEvent, Timer } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-pop-quiz',
  templateUrl: './pop-quiz.component.html',
})
export class MainScreenPopQuizComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy
{
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {}

  ngOnChanges() {}
}
