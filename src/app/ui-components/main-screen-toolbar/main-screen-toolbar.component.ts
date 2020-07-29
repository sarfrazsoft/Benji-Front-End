import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  shareParticipantLink = '';
  shareFacilitatorLink = '';
  constructor(
    private layoutService: LayoutService,
    public contextService: ContextService,
    protected snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.shareParticipantLink = window.location.href + '?share=participant';
    this.shareFacilitatorLink = window.location.href + '?share=facilitator';

    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.lightLogo = info.parameters.lightLogo;
      }
    });
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openSnackBar('copied to clipboard', '');
  }

  ngOnChanges() {
    const as = this.activityState;
    if (as) {
      if (
        as.activity_type === this.at.brainStorm ||
        as.activity_type === this.at.title
      ) {
        if (as.activity_type === this.at.title) {
          if (as.titleactivity.hide_timer) {
            this.showTimer = false;
          } else {
            this.initializeTimer();
          }
        } else if (as.activity_type === this.at.brainStorm) {
          this.initializeTimer();
        }
      } else {
        this.showTimer = false;
      }
    }
  }

  initializeTimer() {
    this.showTimer = true;
    this.contextService.activityTimer$.subscribe((timer: Timer) => {
      if (timer) {
        this.timer = timer;
      }
    });
  }

  toggleFullscreen() {
    this.layoutService.toggleFullscreen();
  }

  isFullscreen() {
    return this.layoutService.isFullscreen;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['bg-success-color', 'white-color', 'simple-snack-bar'],
    });
  }
}
