import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { Timer, UpdateMessage } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'benji-main-screen-toolbar',
  templateUrl: './main-screen-toolbar.component.html',
  styleUrls: ['./main-screen-toolbar.component.scss'],
})
export class MainScreenToolbarComponent implements OnInit, OnChanges {
  darkLogo = '';
  timer: Timer;
  @Input() activityState: UpdateMessage;
  @Input() hideControls = false;
  showTimer = false;
  at: typeof ActivityTypes = ActivityTypes;

  shareParticipantLink = '';
  shareFacilitatorLink = '';
  constructor(
    private layoutService: LayoutService,
    public contextService: ContextService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.shareParticipantLink = window.location.href + '?share=participant';
    this.shareFacilitatorLink = window.location.href + '?share=facilitator';

    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.darkLogo = info.parameters.darkLogo;
      }
    });
  }

  copyMessage(val: string) {
    this.utilsService.copyToClipboard(val);
  }

  ngOnChanges() {}

  toggleFullscreen() {
    this.layoutService.toggleFullscreen();
  }

  isFullscreen() {
    return this.layoutService.isFullscreen;
  }
}
