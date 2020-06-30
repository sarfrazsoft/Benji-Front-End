import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { Timer, UpdateMessage } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'benji-main-screen-toolbar',
  templateUrl: './main-screen-toolbar.component.html',
  styleUrls: ['./main-screen-toolbar.component.scss'],
})
export class MainScreenToolbarComponent implements OnInit, OnChanges {
  lightLogo = '';
  timer: Timer;
  @Input() activityState: UpdateMessage;
  showTimer = false;
  at: typeof ActivityTypes = ActivityTypes;
  constructor(
    private layoutService: LayoutService,
    public contextService: ContextService
  ) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.lightLogo = info.parameters.lightLogo;
      }
    });
  }

  ngOnChanges() {
    if (this.activityState) {
      if (
        this.activityState.activity_type === this.at.brainStorm ||
        this.activityState.activity_type === this.at.title
      ) {
        this.showTimer = true;
        this.contextService.activityTimer$.subscribe((timer: Timer) => {
          if (timer) {
            this.timer = timer;
          }
        });
      } else {
        this.showTimer = false;
      }
    }
  }

  toggleFullscreen() {
    this.layoutService.toggleFullscreen();
  }

  isFullscreen() {
    return this.layoutService.isFullscreen;
  }
}
