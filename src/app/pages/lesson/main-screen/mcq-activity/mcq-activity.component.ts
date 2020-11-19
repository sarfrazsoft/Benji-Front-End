// TODO remove activity if not used
import { Component } from '@angular/core';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-mcq-activity',
  templateUrl: './mcq-activity.component.html',
  styleUrls: ['./mcq-activity.component.scss'],
})
export class MainScreenMcqActivityComponent extends BaseActivityComponent {}
